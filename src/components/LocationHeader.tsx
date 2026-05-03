import { MapPin, ChevronDown, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

export default function LocationHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm font-heading font-bold text-foreground truncate">Connaught Place</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            </div>
            <p className="text-[11px] text-muted-foreground truncate">New Delhi, Delhi 110001</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <Link to="/profile" className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{(user.user_metadata?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}</span>
            </Link>
          ) : (
            <Link to="/login" className="text-sm font-heading font-semibold text-primary">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
