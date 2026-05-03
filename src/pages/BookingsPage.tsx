import { useEffect, useState } from "react";
import LocationHeader from "@/components/LocationHeader";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Clock, Check, MapPin, Navigation, Package, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const statusConfig: Record<string, { label: string; color: string; icon: any; bg: string }> = {
  pending: { label: "Finding Provider", color: "text-warning", icon: Clock, bg: "bg-warning/10" },
  accepted: { label: "Provider Assigned", color: "text-info", icon: Check, bg: "bg-info/10" },
  en_route: { label: "On the Way", color: "text-primary", icon: Navigation, bg: "bg-primary/10" },
  in_progress: { label: "In Progress", color: "text-accent", icon: Package, bg: "bg-accent/10" },
  completed: { label: "Completed", color: "text-primary", icon: Check, bg: "bg-primary/10" },
  cancelled: { label: "Cancelled", color: "text-destructive", icon: AlertTriangle, bg: "bg-destructive/10" },
};

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }

    const fetchBookings = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*, services(*)")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });
      setBookings(data || []);
      setLoading(false);
    };

    fetchBookings();

    // Realtime subscription
    const channel = supabase
      .channel("my-bookings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings", filter: `customer_id=eq.${user.id}` },
        () => fetchBookings()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, authLoading, navigate]);

  const activeBookings = bookings.filter((b) => !["completed", "cancelled"].includes(b.status));
  const pastBookings = bookings.filter((b) => ["completed", "cancelled"].includes(b.status));

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <LocationHeader />
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <LocationHeader />

      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-heading font-bold text-foreground">My Bookings</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 px-4">
          <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No bookings yet</p>
          <Button variant="hero" size="lg" className="mt-4" onClick={() => navigate("/services")}>
            Browse Services
          </Button>
        </div>
      ) : (
        <div className="px-4 space-y-6 pb-6">
          {/* Active */}
          {activeBookings.length > 0 && (
            <div>
              <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider mb-3">Active</p>
              <div className="space-y-3">
                {activeBookings.map((b, i) => {
                  const cfg = statusConfig[b.status] || statusConfig.pending;
                  const StatusIcon = cfg.icon;
                  return (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card rounded-2xl border border-border p-4 shadow-card"
                    >
                      {/* Status bar */}
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${cfg.bg} mb-3`}>
                        <span className="relative flex h-2 w-2">
                          <span className={`absolute inline-flex h-full w-full rounded-full ${cfg.color.replace("text-", "bg-")} opacity-75 animate-pulse-dot`} />
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.color.replace("text-", "bg-")}`} />
                        </span>
                        <span className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</span>
                      </div>

                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-heading font-bold text-foreground text-[15px]">
                            {b.services?.name || "Service"}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {b.customer_address || "Delhi NCR"}
                          </div>
                          {b.eta_minutes && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-primary font-medium">
                              <Clock className="h-3 w-3" /> ETA {b.eta_minutes} min
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-heading font-bold text-foreground">₹{b.estimated_price}</p>
                          {b.is_emergency && (
                            <span className="text-[10px] font-bold text-emergency">EMERGENCY</span>
                          )}
                        </div>
                      </div>

                      {/* Progress track */}
                      <div className="mt-4 flex gap-1">
                        {["pending", "accepted", "en_route", "in_progress"].map((step, idx) => {
                          const stepOrder = ["pending", "accepted", "en_route", "in_progress"];
                          const currentIdx = stepOrder.indexOf(b.status);
                          const filled = idx <= currentIdx;
                          return (
                            <div key={step} className={`h-1 flex-1 rounded-full ${filled ? "bg-primary" : "bg-border"}`} />
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Past */}
          {pastBookings.length > 0 && (
            <div>
              <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider mb-3">Past</p>
              <div className="space-y-2">
                {pastBookings.map((b) => (
                  <div key={b.id} className="bg-card rounded-xl border border-border p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-heading font-semibold text-foreground">{b.services?.name || "Service"}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(b.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        {" • "}
                        {b.status === "completed" ? "Completed" : "Cancelled"}
                      </p>
                    </div>
                    <p className="text-sm font-heading font-bold text-foreground">₹{b.final_price || b.estimated_price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
