
-- Enums
CREATE TYPE public.booking_status AS ENUM ('pending', 'accepted', 'en_route', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.provider_status AS ENUM ('pending_kyc', 'approved', 'rejected', 'suspended');
CREATE TYPE public.service_category AS ENUM ('plumbing', 'electrical', 'cleaning', 'painting', 'fuel_delivery', 'battery_jump', 'flat_tire', 'urgent_repair');
CREATE TYPE public.app_role AS ENUM ('admin', 'provider', 'customer');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Services catalog
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category service_category NOT NULL,
  description TEXT,
  base_price INTEGER NOT NULL DEFAULT 0,
  avg_eta_minutes INTEGER NOT NULL DEFAULT 15,
  is_emergency BOOLEAN NOT NULL DEFAULT false,
  surge_multiplier NUMERIC(3,2) NOT NULL DEFAULT 1.00,
  icon_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Providers
CREATE TABLE public.providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status provider_status NOT NULL DEFAULT 'pending_kyc',
  service_categories service_category[] NOT NULL DEFAULT '{}',
  kyc_document_url TEXT,
  experience_years INTEGER DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 0.0,
  total_jobs INTEGER DEFAULT 0,
  is_online BOOLEAN NOT NULL DEFAULT false,
  current_lat NUMERIC(10,7),
  current_lng NUMERIC(10,7),
  service_radius_km INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Providers can view own record" ON public.providers FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Providers can update own record" ON public.providers FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert provider application" ON public.providers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all providers" ON public.providers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update providers" ON public.providers FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  provider_id UUID REFERENCES public.providers(id),
  service_id UUID NOT NULL REFERENCES public.services(id),
  status booking_status NOT NULL DEFAULT 'pending',
  is_emergency BOOLEAN NOT NULL DEFAULT false,
  customer_lat NUMERIC(10,7),
  customer_lng NUMERIC(10,7),
  customer_address TEXT,
  estimated_price INTEGER NOT NULL DEFAULT 0,
  final_price INTEGER,
  surge_multiplier NUMERIC(3,2) DEFAULT 1.00,
  eta_minutes INTEGER,
  notes TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can view own bookings" ON public.bookings FOR SELECT TO authenticated USING (auth.uid() = customer_id);
CREATE POLICY "Customers can create bookings" ON public.bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customers can update own bookings" ON public.bookings FOR UPDATE TO authenticated USING (auth.uid() = customer_id);
CREATE POLICY "Providers can view assigned bookings" ON public.bookings FOR SELECT TO authenticated
  USING (provider_id IN (SELECT id FROM public.providers WHERE user_id = auth.uid()));
CREATE POLICY "Providers can update assigned bookings" ON public.bookings FOR UPDATE TO authenticated
  USING (provider_id IN (SELECT id FROM public.providers WHERE user_id = auth.uid()));
CREATE POLICY "Admins can manage all bookings" ON public.bookings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES auth.users(id),
  provider_id UUID NOT NULL REFERENCES public.providers(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Customers can create reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = customer_id);

-- Location logs (for tracking history)
CREATE TABLE public.location_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id),
  lat NUMERIC(10,7) NOT NULL,
  lng NUMERIC(10,7) NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.location_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Providers can insert own logs" ON public.location_logs FOR INSERT TO authenticated
  WITH CHECK (provider_id IN (SELECT id FROM public.providers WHERE user_id = auth.uid()));
CREATE POLICY "Booking participants can view logs" ON public.location_logs FOR SELECT TO authenticated
  USING (
    booking_id IN (SELECT id FROM public.bookings WHERE customer_id = auth.uid())
    OR provider_id IN (SELECT id FROM public.providers WHERE user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

-- Payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id),
  amount INTEGER NOT NULL,
  platform_commission INTEGER NOT NULL DEFAULT 0,
  provider_payout INTEGER NOT NULL DEFAULT 0,
  payment_method TEXT DEFAULT 'cod',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  transaction_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can view own payments" ON public.payments FOR SELECT TO authenticated
  USING (booking_id IN (SELECT id FROM public.bookings WHERE customer_id = auth.uid()));
CREATE POLICY "Admins can manage payments" ON public.payments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for bookings and location_logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.location_logs;

-- Indexes for performance
CREATE INDEX idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX idx_bookings_provider ON public.bookings(provider_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_providers_status ON public.providers(status);
CREATE INDEX idx_providers_online ON public.providers(is_online);
CREATE INDEX idx_location_logs_provider ON public.location_logs(provider_id);
CREATE INDEX idx_location_logs_booking ON public.location_logs(booking_id);
CREATE INDEX idx_services_category ON public.services(category);
