import { useState } from "react";
import LocationHeader from "@/components/LocationHeader";
import BottomNav from "@/components/BottomNav";
import BookingSheet from "@/components/BookingSheet";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, Loader2 } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { Button } from "@/components/ui/button";

export default function EmergencyPage() {
  const { data: services, isLoading } = useServices();
  const emergencyServices = (services || []).filter((s) => s.is_emergency);
  const [selectedService, setSelectedService] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <LocationHeader />

      <div className="px-4 pt-4 pb-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emergency/10 border border-emergency/20 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emergency opacity-75 animate-pulse-dot" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emergency" />
            </span>
            <span className="text-xs font-bold text-emergency uppercase tracking-wider">Priority Dispatch</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Emergency Help</h1>
          <p className="text-sm text-muted-foreground mt-1">Tap a service. We dispatch instantly.</p>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-emergency" /></div>
      ) : (
        <div className="px-4 space-y-3 pb-6">
          {emergencyServices.map((s, i) => {
            const finalPrice = Math.round(s.base_price * Number(s.surge_multiplier));
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setSelectedService(s)}
                className="bg-card rounded-2xl border border-border p-4 shadow-card active:scale-[0.98] transition-all cursor-pointer hover:border-emergency/30"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-emergency/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-emergency" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-foreground text-[15px]">{s.name}</h3>
                      {Number(s.surge_multiplier) > 1.3 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-emergency/10 text-emergency text-[10px] font-bold">
                          {s.surge_multiplier}x
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" /> ~{s.avg_eta_minutes} min
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-heading font-bold text-foreground">₹{finalPrice}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {selectedService && (
        <BookingSheet
          service={{
            ...selectedService,
            surge_multiplier: Number(selectedService.surge_multiplier),
          }}
          onClose={() => setSelectedService(null)}
        />
      )}

      <BottomNav />
    </div>
  );
}
