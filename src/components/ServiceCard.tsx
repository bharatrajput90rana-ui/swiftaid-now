import { Star, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  id: string;
  name: string;
  category: string;
  description: string | null;
  base_price: number;
  avg_eta_minutes: number;
  is_emergency: boolean;
  surge_multiplier: number;
  onBook: (id: string) => void;
}

export default function ServiceCard({ id, name, category, description, base_price, avg_eta_minutes, is_emergency, surge_multiplier, onBook }: ServiceCardProps) {
  const finalPrice = is_emergency ? Math.round(base_price * surge_multiplier) : base_price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-4 shadow-card hover:shadow-card-hover transition-shadow active:scale-[0.98]"
      onClick={() => onBook(id)}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-heading font-bold text-foreground text-[15px] truncate">{name}</h3>
            {is_emergency && (
              <span className="flex-shrink-0 px-1.5 py-0.5 rounded-md bg-emergency/10 text-emergency text-[10px] font-bold uppercase">SOS</span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{description}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {avg_eta_minutes} min</span>
            <span className="capitalize text-foreground/60">{category.replace('_', ' ')}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="text-right">
            <p className="text-base font-heading font-bold text-foreground">₹{finalPrice}</p>
            {is_emergency && surge_multiplier > 1 && (
              <p className="text-[10px] text-emergency font-medium">{surge_multiplier}x surge</p>
            )}
          </div>
          <button className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center active:scale-90 transition-transform">
            <ArrowRight className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
