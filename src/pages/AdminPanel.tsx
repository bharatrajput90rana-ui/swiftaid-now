import { useState } from "react";
import LocationHeader from "@/components/LocationHeader";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Users, ShoppingCart, DollarSign, TrendingUp, Search, CheckCircle, XCircle, MapPin, AlertTriangle, Eye, Loader2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const revenueData = [
  { day: "Mon", revenue: 42000 },
  { day: "Tue", revenue: 55000 },
  { day: "Wed", revenue: 48000 },
  { day: "Thu", revenue: 61000 },
  { day: "Fri", revenue: 73000 },
  { day: "Sat", revenue: 89000 },
  { day: "Sun", revenue: 67000 },
];

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  accepted: "bg-info/10 text-info",
  en_route: "bg-primary/10 text-primary",
  in_progress: "bg-accent/10 text-accent",
  completed: "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function AdminPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: allBookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data } = await supabase.from("bookings").select("*, services(*)").order("created_at", { ascending: false }).limit(50);
      return data || [];
    },
  });

  const { data: providers = [], isLoading: providersLoading } = useQuery({
    queryKey: ["admin-providers"],
    queryFn: async () => {
      const { data } = await supabase.from("providers").select("*, profiles:user_id(full_name)").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const pendingProviders = providers.filter((p: any) => p.status === "pending_kyc");
  const totalRevenue = allBookings.filter((b: any) => b.status === "completed").reduce((s: number, b: any) => s + (b.final_price || b.estimated_price || 0), 0);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <LocationHeader />

      <div className="px-4 pt-4 pb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <h1 className="text-xl font-heading font-bold text-foreground">Admin Panel</h1>
          <p className="text-xs text-muted-foreground">Platform overview & management</p>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: Users, label: "Providers", value: String(providers.length), color: "text-primary" },
            { icon: ShoppingCart, label: "Total Bookings", value: String(allBookings.length), color: "text-info" },
            { icon: DollarSign, label: "Revenue", value: `₹${(totalRevenue / 1000).toFixed(0)}k`, color: "text-warning" },
            { icon: AlertTriangle, label: "Pending KYC", value: String(pendingProviders.length), color: "text-emergency" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-card rounded-2xl border border-border p-3 shadow-card">
              <kpi.icon className={`h-4 w-4 ${kpi.color} mb-1`} />
              <p className="text-xl font-heading font-bold text-foreground">{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-card mb-6">
          <h3 className="text-sm font-heading font-bold text-foreground mb-3">Weekly Revenue</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Live orders */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              Recent Bookings
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-pulse-dot" /><span className="relative inline-flex rounded-full h-2 w-2 bg-primary" /></span>
            </p>
          </div>

          {bookingsLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-2">
              {allBookings.slice(0, 10).map((b: any) => (
                <div key={b.id} className="bg-card rounded-xl border border-border p-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-heading font-semibold text-foreground truncate">{b.services?.name || "Service"}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(b.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      {b.customer_address && ` • ${b.customer_address}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize ${statusColors[b.status] || "bg-secondary text-foreground"}`}>
                      {b.status.replace("_", " ")}
                    </span>
                    <span className="text-sm font-heading font-bold text-foreground">₹{b.estimated_price}</span>
                  </div>
                </div>
              ))}
              {allBookings.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">No bookings yet</p>
              )}
            </div>
          )}
        </div>

        {/* KYC Approvals */}
        {pendingProviders.length > 0 && (
          <div>
            <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3 text-warning" /> Pending KYC
            </p>
            <div className="space-y-2">
              {pendingProviders.map((p: any) => (
                <div key={p.id} className="bg-card rounded-xl border border-border p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-heading font-semibold text-foreground">
                      {(p.profiles as any)?.full_name || "Provider"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{p.experience_years} yrs exp • Applied {new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <Button variant="hero" size="sm" className="h-7 px-2 text-xs">
                      <CheckCircle className="h-3 w-3" /> Approve
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                      <XCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
