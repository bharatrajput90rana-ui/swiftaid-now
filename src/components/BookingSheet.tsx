import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Clock, CreditCard, AlertTriangle, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface BookingSheetProps {
  service: {
    id: string;
    name: string;
    base_price: number;
    avg_eta_minutes: number;
    is_emergency: boolean;
    surge_multiplier: number;
    description: string | null;
  } | null;
  onClose: () => void;
}

export default function BookingSheet({ service, onClose }: BookingSheetProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"confirm" | "booking" | "done">("confirm");
  const [loading, setLoading] = useState(false);

  if (!service) return null;

  const finalPrice = service.is_emergency
    ? Math.round(service.base_price * service.surge_multiplier)
    : service.base_price;
  const platformFee = Math.round(finalPrice * 0.05);
  const total = finalPrice + platformFee;

  const handleBook = async () => {
    if (!user) { navigate("/login"); onClose(); return; }
    setLoading(true);
    setStep("booking");

    const { data, error } = await supabase.from("bookings").insert({
      customer_id: user.id,
      service_id: service.id,
      estimated_price: total,
      is_emergency: service.is_emergency,
      surge_multiplier: service.surge_multiplier,
      status: "pending",
      customer_address: "Connaught Place, New Delhi",
      eta_minutes: service.avg_eta_minutes,
    }).select().single();

    if (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
      setStep("confirm");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setStep("done");
      setLoading(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl max-h-[85vh] overflow-auto safe-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        <div className="px-5 pb-6">
          {/* Close */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-heading font-bold text-foreground">
              {step === "confirm" ? "Confirm Booking" : step === "booking" ? "Finding Provider..." : "Booked! 🎉"}
            </h2>
            <button onClick={onClose} className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {step === "confirm" && (
            <div className="space-y-4 animate-fade-in">
              {/* Service info */}
              <div className="p-4 rounded-2xl bg-secondary/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-heading font-bold text-foreground">{service.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
                  </div>
                  {service.is_emergency && (
                    <span className="px-2 py-1 rounded-lg bg-emergency/10 text-emergency text-xs font-bold flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> SOS
                    </span>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Connaught Place</p>
                    <p className="text-xs text-muted-foreground">New Delhi, 110001</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-9 w-9 rounded-xl bg-info/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-info" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">ETA {service.avg_eta_minutes} minutes</p>
                    <p className="text-xs text-muted-foreground">Nearest provider will be dispatched</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Pay after service</p>
                    <p className="text-xs text-muted-foreground">UPI, Card or Cash</p>
                  </div>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="border-t border-dashed border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service charge</span>
                  <span className="text-foreground">₹{finalPrice}</span>
                </div>
                {service.is_emergency && service.surge_multiplier > 1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emergency">Surge ({service.surge_multiplier}x)</span>
                    <span className="text-emergency">included</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform fee</span>
                  <span className="text-foreground">₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-base font-heading font-bold pt-2 border-t border-border">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">₹{total}</span>
                </div>
              </div>

              <Button
                variant={service.is_emergency ? "emergency" : "hero"}
                size="xl"
                className="w-full"
                onClick={handleBook}
              >
                {service.is_emergency ? "🚨 Emergency Dispatch" : "Confirm Booking"}
              </Button>
            </div>
          )}

          {step === "booking" && (
            <div className="py-12 text-center animate-fade-in space-y-4">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                <div className="relative h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              </div>
              <div>
                <p className="font-heading font-bold text-foreground">Matching you with a provider</p>
                <p className="text-sm text-muted-foreground mt-1">Searching within 5 km radius...</p>
              </div>
              <div className="h-1.5 w-48 mx-auto rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-primary animate-progress-fill" />
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="py-8 text-center animate-fade-in space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-heading font-bold text-lg text-foreground">Booking Confirmed!</p>
                <p className="text-sm text-muted-foreground mt-1">Your provider is on the way</p>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/50 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium text-foreground">{service.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ETA</span>
                  <span className="font-medium text-primary">{service.avg_eta_minutes} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium text-foreground">₹{total}</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Close
                </Button>
                <Button variant="hero" className="flex-1" onClick={() => { onClose(); navigate("/bookings"); }}>
                  Track Order
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
