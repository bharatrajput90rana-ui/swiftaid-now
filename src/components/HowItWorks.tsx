import { motion } from "framer-motion";
import { MapPin, UserCheck, Navigation, Star } from "lucide-react";

const steps = [
  { icon: MapPin, title: "Set Location", desc: "GPS auto-detect or enter your address" },
  { icon: UserCheck, title: "Choose Service", desc: "Pick a service and confirm booking" },
  { icon: Navigation, title: "Track Live", desc: "Watch your provider arrive in real-time" },
  { icon: Star, title: "Rate & Pay", desc: "Pay securely, leave a review" },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-3">How SwiftAid Works</h2>
          <p className="text-muted-foreground">From booking to completion in 4 simple steps.</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-border" />
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="mx-auto h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-glow relative z-10">
                <s.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="absolute -top-2 -right-1 md:right-auto md:left-1/2 md:-translate-x-1/2 md:-top-3 bg-accent text-accent-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {i + 1}
              </span>
              <h3 className="font-heading font-semibold text-foreground mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
