import { Button } from "@/components/ui/button";
import { Zap, MapPin, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { icon: Clock, label: "15 min avg.", desc: "Response time" },
  { icon: MapPin, label: "50+ Areas", desc: "Coverage" },
  { icon: Shield, label: "Verified", desc: "All providers" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="SwiftAid service network" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="relative flex h-2 w-2"><span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-primary" /></span>
              <span className="text-sm font-medium text-primary">Now live in Delhi NCR</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight text-primary-foreground mb-6"
          >
            Help arrives in{" "}
            <span className="text-gradient-primary">minutes</span>,{" "}
            not hours.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-primary-foreground/70 mb-8 max-w-lg"
          >
            On-demand home services & emergency assistance. Real-time tracking, verified providers, instant dispatch.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-3 mb-12"
          >
            <Link to="/services">
              <Button variant="hero" size="xl">
                <Zap className="h-5 w-5" /> Book a Service
              </Button>
            </Link>
            <Link to="/emergency">
              <Button variant="emergency" size="xl">
                🚨 Emergency Now
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex gap-6"
          >
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-foreground">{s.label}</p>
                  <p className="text-xs text-primary-foreground/50">{s.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
