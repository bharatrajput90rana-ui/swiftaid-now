import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Wrench, Droplets, Zap as ZapIcon, Sparkles, Fuel, Battery, Car, ShieldAlert,
} from "lucide-react";

const homeServices = [
  { icon: Wrench, label: "Plumbing", desc: "Leaks, repairs, installation", color: "text-info" },
  { icon: ZapIcon, label: "Electrical", desc: "Wiring, fixtures, repairs", color: "text-warning" },
  { icon: Droplets, label: "Cleaning", desc: "Deep clean, sanitization", color: "text-primary" },
  { icon: Sparkles, label: "Painting", desc: "Interior, exterior, touch-ups", color: "text-accent" },
];

const emergencyServices = [
  { icon: Fuel, label: "Fuel Delivery", desc: "Petrol/diesel at your location", color: "text-emergency" },
  { icon: Battery, label: "Battery Jump", desc: "Dead battery? We'll start it", color: "text-warning" },
  { icon: Car, label: "Flat Tire", desc: "Roadside tire change", color: "text-info" },
  { icon: ShieldAlert, label: "Urgent Repair", desc: "Emergency fixes, 24/7", color: "text-emergency" },
];

function ServiceCard({ icon: Icon, label, desc, color, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
    >
      <Link
        to={`/services?category=${label.toLowerCase()}`}
        className="group block p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
      >
        <div className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-heading font-semibold text-card-foreground mb-1">{label}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </Link>
    </motion.div>
  );
}

export default function ServiceCategories() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-3">Home Services</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Professional services at your doorstep, booked in under 60 seconds.</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {homeServices.map((s, i) => <ServiceCard key={s.label} {...s} index={i} />)}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emergency/10 border border-emergency/20 mb-4">
            <span className="text-xs font-semibold text-emergency uppercase tracking-wider">24/7 Available</span>
          </div>
          <h2 className="text-3xl font-heading font-bold text-foreground mb-3">Emergency Services</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Stranded? Stuck? Help is dispatched in under 2 minutes.</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {emergencyServices.map((s, i) => <ServiceCard key={s.label} {...s} index={i} />)}
        </div>
      </div>
    </section>
  );
}
