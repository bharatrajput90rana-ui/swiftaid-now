import { useState } from "react";
import LocationHeader from "@/components/LocationHeader";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  DollarSign, CheckCircle, XCircle, Navigation, TrendingUp, Star, Clock, MapPin, Loader2, Upload, Briefcase,
} from "lucide-react";

export default function ProviderDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: provider, isLoading } = useQuery({
    queryKey: ["provider", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("providers").select("*").eq("user_id", user.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["provider-bookings", provider?.id],
    queryFn: async () => {
      if (!provider) return [];
      const { data } = await supabase
        .from("bookings")
        .select("*, services(*)")
        .eq("provider_id", provider.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!provider,
  });

  // Onboarding
  const [experience, setExperience] = useState("2");
  const applyMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not logged in");
      const { error } = await supabase.from("providers").insert({
        user_id: user.id,
        experience_years: parseInt(experience) || 0,
        service_categories: ["plumbing", "electrical"],
        status: "pending_kyc",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider"] });
      toast({ title: "Application submitted!", description: "We'll review your profile within 24 hours." });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const toggleOnline = useMutation({
    mutationFn: async () => {
      if (!provider) return;
      const { error } = await supabase.from("providers").update({ is_online: !provider.is_online }).eq("id", provider.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["provider"] }),
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <LocationHeader />
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        <BottomNav />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  // No provider record = onboarding
  if (!provider) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <LocationHeader />
        <div className="px-4 pt-6 max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-6">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-xl font-heading font-bold text-foreground">Become a Provider</h1>
              <p className="text-sm text-muted-foreground mt-1">Earn money by offering services on SwiftAid</p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-5 shadow-card space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Years of Experience</Label>
                <Input value={experience} onChange={(e) => setExperience(e.target.value)} type="number" min="0" className="mt-1 h-11 rounded-xl bg-secondary border-0" />
              </div>
              <div className="p-3 rounded-xl bg-secondary/50 text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">What happens next:</p>
                <ul className="space-y-1 list-disc pl-4">
                  <li>Your application will be reviewed</li>
                  <li>KYC verification (ID proof required)</li>
                  <li>Start accepting jobs once approved</li>
                </ul>
              </div>
              <Button variant="hero" size="lg" className="w-full" onClick={() => applyMutation.mutate()} disabled={applyMutation.isPending}>
                {applyMutation.isPending ? "Submitting..." : "Apply Now"}
              </Button>
            </div>
          </motion.div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Pending KYC
  if (provider.status === "pending_kyc") {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <LocationHeader />
        <div className="px-4 pt-8 text-center max-w-sm mx-auto">
          <div className="h-16 w-16 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-warning" />
          </div>
          <h1 className="text-xl font-heading font-bold text-foreground">Under Review</h1>
          <p className="text-sm text-muted-foreground mt-2">Your application is being reviewed. We'll notify you once approved.</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Active dashboard
  const activeJobs = bookings.filter((b: any) => !["completed", "cancelled"].includes(b.status));
  const completedJobs = bookings.filter((b: any) => b.status === "completed");
  const earnings = completedJobs.reduce((sum: number, b: any) => sum + (b.final_price || b.estimated_price || 0), 0);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <LocationHeader />

      <div className="px-4 pt-4 pb-6">
        {/* Online toggle */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Provider ID: {provider.id.slice(0, 8)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${provider.is_online ? "text-primary" : "text-muted-foreground"}`}>
              {provider.is_online ? "Online" : "Offline"}
            </span>
            <Switch checked={provider.is_online} onCheckedChange={() => toggleOnline.mutate()} />
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: DollarSign, value: `₹${earnings.toLocaleString()}`, label: "Earnings", color: "text-primary" },
            { icon: TrendingUp, value: String(completedJobs.length), label: "Completed", color: "text-info" },
            { icon: Star, value: String(provider.rating || "0.0"), label: "Rating", color: "text-warning" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-2xl border border-border p-3 shadow-card">
              <s.icon className={`h-4 w-4 ${s.color} mb-1`} />
              <p className="text-lg font-heading font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Active jobs */}
        <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider mb-3">Active Jobs</p>
        {activeJobs.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-6 text-center shadow-card mb-6">
            <p className="text-sm text-muted-foreground">No active jobs right now</p>
            <p className="text-xs text-muted-foreground mt-1">Stay online to receive requests</p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {activeJobs.map((job: any) => (
              <div key={job.id} className="bg-card rounded-2xl border border-primary/20 p-4 shadow-card">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-heading font-bold text-foreground text-[15px]">{job.services?.name || "Service"}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {job.customer_address || "Delhi NCR"}
                    </p>
                  </div>
                  <p className="text-base font-heading font-bold text-foreground">₹{job.estimated_price}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="hero" size="sm" className="flex-1">
                    <Navigation className="h-4 w-4" /> Navigate
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <CheckCircle className="h-4 w-4" /> Complete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* History */}
        {completedJobs.length > 0 && (
          <>
            <p className="text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider mb-3">History</p>
            <div className="space-y-2">
              {completedJobs.slice(0, 10).map((job: any) => (
                <div key={job.id} className="bg-card rounded-xl border border-border p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-heading font-semibold text-foreground">{job.services?.name}</p>
                    <p className="text-[11px] text-muted-foreground">{new Date(job.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                  </div>
                  <p className="text-sm font-heading font-bold text-foreground">₹{job.final_price || job.estimated_price}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
