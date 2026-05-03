import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LocationHeader from "@/components/LocationHeader";
import BottomNav from "@/components/BottomNav";
import ServiceCard from "@/components/ServiceCard";
import BookingSheet from "@/components/BookingSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { motion } from "framer-motion";

const categories = [
  { key: "all", label: "All" },
  { key: "plumbing", label: "Plumbing" },
  { key: "electrical", label: "Electrical" },
  { key: "cleaning", label: "Cleaning" },
  { key: "painting", label: "Painting" },
];

export default function ServicesPage() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "all";
  const [category, setCategory] = useState(initialCat);
  const [search, setSearch] = useState("");
  const { data: services, isLoading } = useServices(category);
  const [selectedService, setSelectedService] = useState<any>(null);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
  }, [searchParams]);

  const filtered = (services || []).filter(
    (s) => !s.is_emergency && s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <LocationHeader />

      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-secondary border-0"
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto hide-scrollbar">
        {categories.map((c) => (
          <Button
            key={c.key}
            variant={category === c.key ? "pillActive" : "pill"}
            size="pill"
            onClick={() => setCategory(c.key)}
          >
            {c.label}
          </Button>
        ))}
      </div>

      <div className="px-4 mb-3">
        <p className="text-xs text-muted-foreground">
          {isLoading ? "Loading..." : `${filtered.length} services available near you`}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : (
        <div className="px-4 space-y-3 pb-6">
          {filtered.map((s) => (
            <ServiceCard
              key={s.id}
              id={s.id}
              name={s.name}
              category={s.category}
              description={s.description}
              base_price={s.base_price}
              avg_eta_minutes={s.avg_eta_minutes}
              is_emergency={s.is_emergency}
              surge_multiplier={Number(s.surge_multiplier)}
              onBook={() => setSelectedService(s)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-muted-foreground">No services found</p>
            </div>
          )}
        </div>
      )}

      {selectedService && (
        <BookingSheet
          service={{
            ...selectedService,
            surge_multiplier: Number(selectedService.surge_multiplier),
          }}
          onClose={() => setSelectedService(null)}
        />
      )}

      <BottomNav />
    </div>
  );
}
