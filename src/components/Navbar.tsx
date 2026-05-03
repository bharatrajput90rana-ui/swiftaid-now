import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { to: "/services", label: "Services" },
  { to: "/emergency", label: "Emergency", emergency: true },
  { to: "/provider", label: "For Providers" },
  { to: "/admin", label: "Admin" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-glow">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">
            Swift<span className="text-primary">Aid</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to}>
              <Button
                variant={location.pathname === l.to ? "default" : "ghost"}
                size="sm"
                className={l.emergency ? "text-emergency hover:text-emergency" : ""}
              >
                {l.emergency && <span className="relative flex h-2 w-2 mr-1"><span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-emergency opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emergency" /></span>}
                {l.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground truncate max-w-[150px]">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}><LogOut className="h-4 w-4" /></Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
              <Link to="/signup"><Button variant="hero" size="sm">Sign up</Button></Link>
            </>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-card border-b border-border"
          >
            <div className="p-4 flex flex-col gap-2">
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">{l.label}</Button>
                </Link>
              ))}
              <div className="flex gap-2 pt-2 border-t border-border">
                {user ? (
                  <Button variant="outline" className="w-full" onClick={handleSignOut}>Sign out</Button>
                ) : (
                  <>
                    <Link to="/login" className="flex-1"><Button variant="outline" className="w-full">Log in</Button></Link>
                    <Link to="/signup" className="flex-1"><Button variant="hero" className="w-full">Sign up</Button></Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
