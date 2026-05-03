import LocationHeader from "@/components/LocationHeader";
import BottomNav from "@/components/BottomNav";
import CategoryGrid from "@/components/CategoryGrid";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Zap, Shield, Clock, ArrowRight, Star, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServices } from "@/hooks/useServices";
import heroBg from "@/assets/hero-bg.jpg";

export default function Index() {
  const { data: services } = useServices();
  const emergencyServices = (services || []).filter((s) => s.is_emergency);
  const topServices = (services || []).filter((s) => !s.is_emergency).slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <LocationHeader />

      {/* Search Bar */}
      <div className="px-4 py-3">
        <Link to="/services" className="flex items-center gap-3 h-11 px-4 rounded-xl bg-secondary border border-border text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          Search for services...
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="px-4 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden h-40"
        >
          <img src={heroBg} alt="SwiftAid dispatch" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-hero opacity-75" />
          <div className="relative z-10 p-5 h-full flex flex-col justify-end">
            <h1 className="text-xl font-heading font-bold text-primary-foreground leading-tight">
              Help arrives in <span className="text-gradient-primary">minutes</span>
            </h1>
            <p className="text-xs text-primary-foreground/70 mt-1">On-demand home services & emergency help</p>
            <div className="flex gap-4 mt-3">
              {[
                { icon: Clock, text: "15 min avg" },
                { icon: Shield, text: "Verified" },
                { icon: Star, text: "4.8★" },
              ].map((s) => (
                <span key={s.text} className="flex items-center gap-1 text-[10px] text-primary-foreground/80">
                  <s.icon className="h-3 w-3" /> {s.text}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-6">
        <h2 className="text-base font-heading font-bold text-foreground mb-3">What do you need?</h2>
        <CategoryGrid />
      </div>

      {/* Emergency Banner */}
      <div className="px-4 mb-6">
        <Link to="/emergency">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-emergency rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emergency-foreground/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-emergency-foreground" />
              </div>
              <div>
                <p className="text-sm font-heading font-bold text-emergency-foreground">Emergency? Get help NOW</p>
                <p className="text-[11px] text-emergency-foreground/70">Fuel, battery, tire fix — dispatched in 2 min</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-emergency-foreground" />
          </motion.div>
        </Link>
      </div>

      {/* Popular Services */}
      {topServices.length > 0 && (
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-heading font-bold text-foreground">Popular near you</h2>
            <Link to="/services" className="text-xs font-medium text-primary">See all</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4">
            {topServices.map((s) => (
              <Link key={s.id} to={`/services?category=${s.category}`} className="flex-shrink-0 w-36">
                <div className="bg-card rounded-2xl border border-border p-3 shadow-card active:scale-[0.97] transition-transform">
                  <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm font-heading font-semibold text-foreground truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">₹{s.base_price} • {s.avg_eta_minutes} min</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="px-4 mb-8">
        <h2 className="text-base font-heading font-bold text-foreground mb-3">How SwiftAid works</h2>
        <div className="flex gap-3">
          {[
            { step: "1", title: "Choose", desc: "Pick a service" },
            { step: "2", title: "Book", desc: "Confirm & pay" },
            { step: "3", title: "Track", desc: "Live updates" },
          ].map((s) => (
            <div key={s.step} className="flex-1 bg-card rounded-2xl border border-border p-3 text-center shadow-card">
              <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mx-auto mb-1.5">{s.step}</div>
              <p className="text-xs font-heading font-bold text-foreground">{s.title}</p>
              <p className="text-[10px] text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Navbar fallback */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50">
        {/* LocationHeader already handles this */}
      </div>

      <BottomNav />
    </div>
  );
}
