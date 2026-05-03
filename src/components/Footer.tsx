import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-bold text-foreground">Swift<span className="text-primary">Aid</span></span>
            </div>
            <p className="text-sm text-muted-foreground">On-demand home services & emergency assistance. Help arrives in minutes.</p>
          </div>
          {[
            { title: "Services", links: [["Home Services", "/services"], ["Emergency", "/emergency"], ["Pricing", "/services"]] },
            { title: "Company", links: [["About", "/"], ["Careers", "/"], ["Blog", "/"]] },
            { title: "Support", links: [["Help Center", "/"], ["Safety", "/"], ["Terms", "/"]] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-heading font-semibold text-foreground mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(([label, to]) => (
                  <li key={label}><Link to={to} className="text-sm text-muted-foreground hover:text-primary transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © 2026 SwiftAid. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
