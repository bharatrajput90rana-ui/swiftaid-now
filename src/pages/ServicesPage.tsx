import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { MapPin, Search, Star, Clock, ChevronRight, Loader2 } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const categories = ["all", "plumbing", "electrical", "cleaning", "painting"];

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const { data: services, isLoading } = useServices(category);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookingId, setBookingId] = useState<string | null>(null);

  const handleBook = async (serviceId: string, price: number, isEmergency: boolean) => {
    if (!user) {
      navigate("/login");
      return;
    }
    const { data, error } = await supabase.from("bookings").insert({
      customer_id: user.id,
      service_id: serviceId,
      estimated_price: price,
      is_emergency: isEmergency,
      status: "pending",
    }).select().single();

    if (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
    } else {
      setBookingId(data.id);
      toast({ title: "Booking created!", description: `Order ${data.id.slice(0, 8)} is being matched with a provider.` });
    }
  };

  const filtered = (services || []).filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) && !s.is_emergency
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Browse Services</h1>
            <p className="text-muted-foreground mb-6">Choose a service and get help at your doorstep.</p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search services..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Delhi NCR</span>
            </div>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map((c) => (
              <Button key={c} variant={category === c ? "default" : "outline"} size="sm" onClick={() => setCategory(c)} className="capitalize whitespace-nowrap">
                {c}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-heading font-semibold text-card-foreground">{service.name}</h3>
                      <Badge variant="secondary" className="mt-1 capitalize">{service.category}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">₹{service.base_price}</p>
                      <p className="text-xs text-muted-foreground">starting</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> ~{service.avg_eta_minutes} min</span>
                  </div>
                  <Button
                    variant="hero"
                    size="sm"
                    className="w-full"
                    onClick={() => handleBook(service.id, service.base_price, service.is_emergency)}
                  >
                    Book Now <ChevronRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground py-12">No services found.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
