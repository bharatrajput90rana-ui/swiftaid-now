import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { MapPin, Search, Star, Clock, ChevronRight } from "lucide-react";

const allServices = [
  { id: 1, name: "Plumber", category: "plumbing", rating: 4.8, price: 299, eta: "15 min", available: 12 },
  { id: 2, name: "Electrician", category: "electrical", rating: 4.9, price: 349, eta: "12 min", available: 8 },
  { id: 3, name: "Deep Cleaning", category: "cleaning", rating: 4.7, price: 999, eta: "30 min", available: 15 },
  { id: 4, name: "AC Repair", category: "electrical", rating: 4.6, price: 499, eta: "20 min", available: 6 },
  { id: 5, name: "Painter", category: "painting", rating: 4.5, price: 799, eta: "45 min", available: 4 },
  { id: 6, name: "Carpenter", category: "plumbing", rating: 4.7, price: 449, eta: "25 min", available: 7 },
];

const categories = ["all", "plumbing", "electrical", "cleaning", "painting"];

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = allServices.filter(
    (s) =>
      (category === "all" || s.category === category) &&
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Browse Services</h1>
            <p className="text-muted-foreground mb-6">Choose a service and get help at your doorstep.</p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Delhi NCR</span>
            </div>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map((c) => (
              <Button
                key={c}
                variant={category === c ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(c)}
                className="capitalize whitespace-nowrap"
              >
                {c}
              </Button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-heading font-semibold text-card-foreground">{service.name}</h3>
                    <Badge variant="secondary" className="mt-1 capitalize">{service.category}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">₹{service.price}</p>
                    <p className="text-xs text-muted-foreground">starting</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-warning fill-warning" /> {service.rating}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {service.eta}</span>
                  <span className="text-primary font-medium">{service.available} available</span>
                </div>
                <Button variant="hero" size="sm" className="w-full group-hover:shadow-glow">
                  Book Now <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
