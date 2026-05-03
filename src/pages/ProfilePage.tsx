import { useState } from "react";
import LocationHeader from "@/components/LocationHeader";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User, Mail, Phone, LogOut, ChevronRight, Shield, HelpCircle, FileText, Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setName(data.full_name || "");
        setPhone(data.phone || "");
      }
      return data;
    },
    enabled: !!user,
  });

  const updateProfile = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase.from("profiles").update({ full_name: name, phone }).eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setEditing(false);
      toast({ title: "Profile updated" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <LocationHeader />
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        <BottomNav />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <LocationHeader />
        <div className="text-center py-20 px-4">
          <User className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-lg font-heading font-bold text-foreground mb-1">Sign in to continue</p>
          <p className="text-sm text-muted-foreground mb-4">Access bookings, track orders, and more</p>
          <Link to="/login"><Button variant="hero" size="lg">Sign In</Button></Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <LocationHeader />

      <div className="px-4 pt-4 pb-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-4 mb-4 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-heading font-bold text-primary">
                {(profile?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-heading font-bold text-foreground truncate">
                {profile?.full_name || "Your Name"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
              {editing ? "Cancel" : "Edit"}
            </Button>
          </div>

          {editing && (
            <div className="space-y-3 pt-3 border-t border-border animate-fade-in">
              <div>
                <Label className="text-xs text-muted-foreground">Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-10 rounded-xl bg-secondary border-0" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="mt-1 h-10 rounded-xl bg-secondary border-0" />
              </div>
              <Button
                variant="hero"
                className="w-full"
                onClick={() => updateProfile.mutate()}
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </motion.div>

        {/* Menu items */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden mb-4">
          {[
            { icon: Shield, label: "Become a Provider", to: "/provider", desc: "Earn by offering services" },
            { icon: FileText, label: "Admin Panel", to: "/admin", desc: "Platform management" },
          ].map((item, i) => (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 p-4 active:bg-secondary transition-colors ${i > 0 ? "border-t border-border" : ""}`}
            >
              <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center">
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden mb-6">
          {[
            { icon: HelpCircle, label: "Help & Support" },
            { icon: FileText, label: "Terms of Service" },
            { icon: Shield, label: "Privacy Policy" },
          ].map((item, i) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 p-4 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground flex-1">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full text-destructive hover:text-destructive" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>

        <p className="text-center text-[10px] text-muted-foreground mt-4">SwiftAid v1.0 • © 2026</p>
      </div>

      <BottomNav />
    </div>
  );
}
