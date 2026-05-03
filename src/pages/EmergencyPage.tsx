import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { AlertTriangle, MapPin, Clock, Phone, Loader2 } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function EmergencyPage() {
  const { data: services, isLoading } = useServices();
  const emergencyServices = (services || []).filter((s) => s.is_emergency);
  const [selected, setSelected] = useState<string | null>(null);
  const [dispatching, setDispatching] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [assigned, setAssigned] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (dispatching && countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
    if (dispatching && countdown === 0) {
      setDispatching(false);
      setAssigned(true);
    }
  }, [dispatching, countdown]);

  const handleDispatch = async () => {
    if (!user) { navigate("/login"); return; }
    if (!selected) return;

    const service = emergencyServices.find((s) => s.id === selected);
    if (!service) return;

    const price = Math.round(service.base_price * Number(service.surge_multiplier));
    const { error } = await supabase.from("bookings").insert({
      customer_id: user.id,
      service_id: service.id,
      estimated_price: price,
      is_emergency: true,
      surge_multiplier: Number(service.surge_multiplier),
      status: "pending",
    });

    if (error) {
      toast({ title: "Dispatch failed", description: error.message, variant: "destructive" });
      return;
    }

    setDispatching(true);
    setCountdown(10);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background"><Navbar /><div className="pt-24 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emergency/10 border border-emergency/20 mb-4">
              <AlertTriangle className="h-4 w-4 text-emergency" />
              <span className="text-sm font-semibold text-emergency">Emergency Dispatch — Priority Queue Active</span>
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Emergency Help Now</h1>
            <p className="text-muted-foreground">Select your emergency. We'll dispatch the nearest provider immediately.</p>
          </motion.div>

          {dispatching ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <div className="relative inline-flex mb-6">
                <div className="h-24 w-24 rounded-full bg-emergency/20 flex items-center justify-center animate-pulse">
                  <div className="h-16 w-16 rounded-full bg-emergency flex items-center justify-center">
                    <span className="text-2xl font-heading font-bold text-emergency-foreground">{countdown}</span>
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-2">Finding nearest provider...</h2>
              <p className="text-muted-foreground mb-1">Searching within 5 km radius</p>
              <p className="text-sm text-muted-foreground">Auto-reassigning if no response in {countdown}s</p>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" /> Detected: Connaught Place, Delhi
              </div>
            </motion.div>
          ) : assigned ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-2xl text-primary-foreground">✓</span>
                </div>
              </div>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-2">Booking Created!</h2>
              <p className="text-muted-foreground mb-4">Your emergency request has been logged and is awaiting provider assignment.</p>
              <Button variant="hero" onClick={() => navigate("/services")}>Back to Services</Button>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {emergencyServices.map((s, i) => {
                const isSelected = selected === s.id;
                const surgePrice = Math.round(s.base_price * Number(s.surge_multiplier));
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setSelected(s.id)}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected ? "border-emergency bg-emergency/5 shadow-lg" : "border-border bg-card hover:border-emergency/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${isSelected ? "bg-emergency/20" : "bg-muted"}`}>
                        <AlertTriangle className={`h-6 w-6 ${isSelected ? "text-emergency" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-semibold text-card-foreground">{s.name}</h3>
                          {Number(s.surge_multiplier) > 1.3 && <Badge variant="destructive" className="text-xs">Surge {s.surge_multiplier}x</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{s.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">₹{surgePrice}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> ~{s.avg_eta_minutes} min
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <Button variant="emergency" size="xl" className="mt-4 w-full" disabled={selected === null} onClick={handleDispatch}>
                🚨 Dispatch Now
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
