import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import {
  MapPin, DollarSign, Clock, CheckCircle, XCircle, Navigation, TrendingUp, Star,
} from "lucide-react";

const mockJobs = [
  { id: 1, customer: "Ankit S.", service: "Plumbing Repair", distance: "2.3 km", fare: 449, status: "pending", time: "2 min ago" },
  { id: 2, customer: "Priya M.", service: "Electrical Fix", distance: "1.1 km", fare: 349, status: "pending", time: "Just now" },
];

const pastJobs = [
  { id: 3, customer: "Ravi K.", service: "AC Repair", fare: 899, rating: 5, date: "Today" },
  { id: 4, customer: "Neha G.", service: "Deep Cleaning", fare: 1499, rating: 4, date: "Yesterday" },
  { id: 5, customer: "Suresh P.", service: "Plumbing", fare: 399, rating: 5, date: "Yesterday" },
];

export default function ProviderDashboard() {
  const [online, setOnline] = useState(true);
  const [jobs, setJobs] = useState(mockJobs);

  const handleAccept = (id: number) => {
    setJobs(jobs.map((j) => (j.id === id ? { ...j, status: "accepted" } : j)));
  };
  const handleReject = (id: number) => {
    setJobs(jobs.filter((j) => j.id !== id));
  };

  const todayEarnings = 2847;
  const weekEarnings = 18420;
  const completedToday = 7;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">Provider Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Rajesh</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${online ? "text-primary" : "text-muted-foreground"}`}>
                {online ? "Online" : "Offline"}
              </span>
              <Switch checked={online} onCheckedChange={setOnline} />
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: DollarSign, label: "Today's Earnings", value: `₹${todayEarnings.toLocaleString()}`, color: "text-primary" },
              { icon: TrendingUp, label: "This Week", value: `₹${weekEarnings.toLocaleString()}`, color: "text-warning" },
              { icon: CheckCircle, label: "Completed Today", value: completedToday.toString(), color: "text-info" },
            ].map((stat) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-card border border-border">
                <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
                <p className="text-2xl font-heading font-bold text-card-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Incoming Jobs */}
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
            Incoming Requests
            {jobs.filter((j) => j.status === "pending").length > 0 && (
              <span className="relative flex h-3 w-3"><span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-emergency opacity-75" /><span className="relative inline-flex rounded-full h-3 w-3 bg-emergency" /></span>
            )}
          </h2>
          <div className="space-y-3 mb-8">
            {jobs.filter((j) => j.status === "pending").map((job) => (
              <motion.div key={job.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 rounded-xl bg-card border-2 border-warning/30 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-heading font-semibold text-card-foreground">{job.service}</p>
                    <p className="text-sm text-muted-foreground">{job.customer} • {job.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">₹{job.fare}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {job.distance}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="hero" size="sm" className="flex-1" onClick={() => handleAccept(job.id)}>
                    <CheckCircle className="h-4 w-4" /> Accept
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleReject(job.id)}>
                    <XCircle className="h-4 w-4" /> Decline
                  </Button>
                </div>
              </motion.div>
            ))}
            {jobs.filter((j) => j.status === "accepted").map((job) => (
              <div key={job.id} className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className="mb-1">Active Job</Badge>
                    <p className="font-heading font-semibold text-card-foreground">{job.service} — {job.customer}</p>
                  </div>
                  <Button variant="hero" size="sm"><Navigation className="h-4 w-4" /> Navigate</Button>
                </div>
              </div>
            ))}
            {jobs.filter((j) => j.status === "pending").length === 0 && jobs.filter((j) => j.status === "accepted").length === 0 && (
              <p className="text-center text-muted-foreground py-8">No incoming requests right now.</p>
            )}
          </div>

          {/* Past Jobs */}
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">Recent History</h2>
          <div className="space-y-2">
            {pastJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                <div>
                  <p className="font-medium text-card-foreground text-sm">{job.service}</p>
                  <p className="text-xs text-muted-foreground">{job.customer} • {job.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: job.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-warning fill-warning" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-foreground">₹{job.fare}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
