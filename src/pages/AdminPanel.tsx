import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Users, ShoppingCart, DollarSign, TrendingUp, Search, CheckCircle, XCircle, MapPin, AlertTriangle, Eye,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts";

const revenueData = [
  { day: "Mon", revenue: 42000, orders: 38 },
  { day: "Tue", revenue: 55000, orders: 52 },
  { day: "Wed", revenue: 48000, orders: 45 },
  { day: "Thu", revenue: 61000, orders: 58 },
  { day: "Fri", revenue: 73000, orders: 71 },
  { day: "Sat", revenue: 89000, orders: 85 },
  { day: "Sun", revenue: 67000, orders: 63 },
];

const pendingProviders = [
  { id: 1, name: "Amit Verma", service: "Electrician", experience: "5 yrs", documents: 3, status: "pending" },
  { id: 2, name: "Sunita Devi", service: "Cleaning", experience: "3 yrs", documents: 2, status: "pending" },
  { id: 3, name: "Mohd. Iqbal", service: "Plumber", experience: "8 yrs", documents: 3, status: "pending" },
];

const liveOrders = [
  { id: "ORD-1247", customer: "Ravi S.", provider: "Rajesh K.", service: "Plumbing", status: "en-route", area: "Connaught Place" },
  { id: "ORD-1248", customer: "Priya M.", provider: "Sunita D.", service: "Cleaning", status: "in-progress", area: "Hauz Khas" },
  { id: "ORD-1249", customer: "Ankit G.", provider: "—", service: "Fuel Delivery", status: "dispatching", area: "Dwarka" },
  { id: "ORD-1250", customer: "Neha P.", provider: "Mohd. I.", service: "Electrical", status: "completed", area: "Rohini" },
];

const statusColors: Record<string, string> = {
  "en-route": "bg-info/10 text-info border-info/20",
  "in-progress": "bg-warning/10 text-warning border-warning/20",
  dispatching: "bg-emergency/10 text-emergency border-emergency/20",
  completed: "bg-primary/10 text-primary border-primary/20",
};

export default function AdminPanel() {
  const [search, setSearch] = useState("");
  const [providers, setProviders] = useState(pendingProviders);

  const approveProvider = (id: number) => {
    setProviders(providers.map((p) => (p.id === id ? { ...p, status: "approved" } : p)));
  };
  const rejectProvider = (id: number) => {
    setProviders(providers.map((p) => (p.id === id ? { ...p, status: "rejected" } : p)));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl font-heading font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform overview & management</p>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: "Active Users", value: "12,847", change: "+12%", color: "text-primary" },
              { icon: ShoppingCart, label: "Today's Orders", value: "412", change: "+18%", color: "text-info" },
              { icon: DollarSign, label: "Today's Revenue", value: "₹4,35,000", change: "+22%", color: "text-warning" },
              { icon: TrendingUp, label: "Avg. Response", value: "14 min", change: "-8%", color: "text-primary" },
            ].map((kpi) => (
              <motion.div key={kpi.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  <span className={`text-xs font-medium ${kpi.change.startsWith("+") ? "text-primary" : "text-emergency"}`}>{kpi.change}</span>
                </div>
                <p className="text-2xl font-heading font-bold text-card-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="p-5 rounded-xl bg-card border border-border">
              <h3 className="font-heading font-semibold text-card-foreground mb-4">Weekly Revenue</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Orders Trend */}
            <div className="p-5 rounded-xl bg-card border border-border">
              <h3 className="font-heading font-semibold text-card-foreground mb-4">Orders Trend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ fill: "hsl(var(--accent))" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Live Orders */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                Live Orders
                <span className="relative flex h-2.5 w-2.5"><span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" /></span>
              </h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-9" />
              </div>
            </div>
            <div className="grid gap-3">
              {liveOrders
                .filter((o) => o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()))
                .map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="font-mono font-semibold text-card-foreground">{order.id}</span>
                        <p className="text-xs text-muted-foreground">{order.service}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-card-foreground">{order.customer} → {order.provider}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {order.area}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${statusColors[order.status]} border capitalize`}>{order.status}</Badge>
                      <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* KYC Approvals */}
          <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" /> Pending KYC Approvals
          </h3>
          <div className="space-y-3">
            {providers.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                <div>
                  <p className="font-heading font-semibold text-card-foreground">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.service} • {p.experience} • {p.documents} docs uploaded</p>
                </div>
                <div className="flex items-center gap-2">
                  {p.status === "pending" ? (
                    <>
                      <Button variant="hero" size="sm" onClick={() => approveProvider(p.id)}>
                        <CheckCircle className="h-4 w-4" /> Approve
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => rejectProvider(p.id)}>
                        <XCircle className="h-4 w-4" /> Reject
                      </Button>
                    </>
                  ) : (
                    <Badge variant={p.status === "approved" ? "default" : "destructive"} className="capitalize">
                      {p.status}
                    </Badge>
                  )}
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
