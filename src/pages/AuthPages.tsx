import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, User, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export function LoginPage() {
  const [phone, setPhone] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-8 rounded-2xl bg-card border border-border shadow-lg">
          <div className="text-center mb-6">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-3 shadow-glow">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-card-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your SwiftAid account</p>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="phone" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" />
              </div>
            </div>
            <Button variant="hero" size="lg" className="w-full">Send OTP</Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or continue with</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline">Google</Button>
              <Button variant="outline">Apple</Button>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function SignupPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-8 rounded-2xl bg-card border border-border shadow-lg">
          <div className="text-center mb-6">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-3 shadow-glow">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-card-foreground">Create Account</h1>
            <p className="text-sm text-muted-foreground">Join SwiftAid — help is a tap away</p>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="relative mt-1"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="name" placeholder="Your name" className="pl-10" /></div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="email" type="email" placeholder="you@example.com" className="pl-10" /></div>
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <div className="relative mt-1"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="phone" placeholder="+91 98765 43210" className="pl-10" /></div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="password" type="password" placeholder="••••••••" className="pl-10" /></div>
            </div>
            <Button variant="hero" size="lg" className="w-full">Create Account</Button>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
