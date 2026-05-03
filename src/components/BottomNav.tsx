import { Link, useLocation } from "react-router-dom";
import { Home, Search, AlertTriangle, ClipboardList, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/services", icon: Search, label: "Services" },
  { to: "/emergency", icon: AlertTriangle, label: "SOS", emergency: true },
  { to: "/bookings", icon: ClipboardList, label: "Bookings" },
  { to: "/profile", icon: User, label: "Account" },
];

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-bottom-nav safe-bottom md:hidden">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.to || (tab.to !== "/" && location.pathname.startsWith(tab.to));
          const needsAuth = tab.to === "/bookings" || tab.to === "/profile";
          const linkTo = needsAuth && !user ? "/login" : tab.to;

          return (
            <Link
              key={tab.to}
              to={linkTo}
              className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
                tab.emergency
                  ? "text-emergency"
                  : isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {tab.emergency ? (
                <div className="relative">
                  <div className="h-8 w-8 -mt-4 rounded-full bg-emergency flex items-center justify-center shadow-md">
                    <tab.icon className="h-4 w-4 text-emergency-foreground" />
                  </div>
                </div>
              ) : (
                <tab.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 1.5} />
              )}
              <span className={`text-[10px] leading-none ${tab.emergency ? "mt-0" : ""} ${isActive ? "font-semibold" : "font-normal"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
