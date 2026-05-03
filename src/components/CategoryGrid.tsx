import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Wrench, Zap, Droplets, Sparkles, Fuel, Battery, Car, ShieldAlert } from "lucide-react";

const categories = [
  { icon: Wrench, label: "Plumbing", color: "bg-blue-50 text-blue-600", query: "plumbing" },
  { icon: Zap, label: "Electrical", color: "bg-amber-50 text-amber-600", query: "electrical" },
  { icon: Droplets, label: "Cleaning", color: "bg-teal-50 text-teal-600", query: "cleaning" },
  { icon: Sparkles, label: "Painting", color: "bg-purple-50 text-purple-600", query: "painting" },
  { icon: Fuel, label: "Fuel", color: "bg-red-50 text-red-600", query: "fuel_delivery" },
  { icon: Battery, label: "Battery", color: "bg-yellow-50 text-yellow-700", query: "battery_jump" },
  { icon: Car, label: "Tire Fix", color: "bg-sky-50 text-sky-600", query: "flat_tire" },
  { icon: ShieldAlert, label: "Urgent", color: "bg-rose-50 text-rose-600", query: "urgent_repair" },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
        >
          <Link
            to={`/services?category=${cat.query}`}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className={`h-14 w-14 rounded-2xl ${cat.color} flex items-center justify-center transition-transform group-active:scale-90`}>
              <cat.icon className="h-6 w-6" />
            </div>
            <span className="text-[11px] font-medium text-foreground text-center leading-tight">{cat.label}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
