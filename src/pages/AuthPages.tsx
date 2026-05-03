import { useState } from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, User, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useToast } from "@/hooks/use-toast";
import LocationHeader from "@/components/LocationHeader";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/");
    }
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      toast({ title: "Google login failed", description: String(result.error), variant: "destructive" });
      return;
    }
    if (result.redirected) return;
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <LocationHeader />
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)] px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-3">
              <Zap className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to SwiftAid</p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 rounded-xl bg-secondary border-0" required />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-11 rounded-xl bg-secondary border-0" required />
                </div>
              </div>
              <Button variant="hero" size="lg" className="w-full" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-[10px]"><span className="bg-card px-2 text-muted-foreground">or</span></div>
            </div>

            <Button variant="outline" className="w-full h-11 rounded-xl" onClick={handleGoogle}>
              Sign in with Google
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            New here? <Link to="/signup" className="text-primary font-semibold">Create account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name }, emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "Confirm your account to get started." });
      navigate("/login");
    }
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      toast({ title: "Error", description: String(result.error), variant: "destructive" });
      return;
    }
    if (result.redirected) return;
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <LocationHeader />
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)] px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-3">
              <Zap className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-1">Join SwiftAid today</p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-5 shadow-card">
            <form onSubmit={handleSignup} className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Full Name</Label>
                <div className="relative mt-1"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-11 rounded-xl bg-secondary border-0" required /></div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <div className="relative mt-1"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 rounded-xl bg-secondary border-0" required /></div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Password</Label>
                <div className="relative mt-1"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-11 rounded-xl bg-secondary border-0" required minLength={6} /></div>
              </div>
              <Button variant="hero" size="lg" className="w-full" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-[10px]"><span className="bg-card px-2 text-muted-foreground">or</span></div>
            </div>

            <Button variant="outline" className="w-full h-11 rounded-xl" onClick={handleGoogle}>
              Sign up with Google
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account? <Link to="/login" className="text-primary font-semibold">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
