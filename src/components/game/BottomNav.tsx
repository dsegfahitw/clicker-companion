import { Link, useLocation } from "@tanstack/react-router";
import { Home, Briefcase, Building2, GraduationCap, ShoppingBag, Settings } from "lucide-react";

const TABS = [
  { to: "/", label: "Життя", icon: Home },
  { to: "/work", label: "Робота", icon: Briefcase },
  { to: "/business", label: "Бізнес", icon: Building2 },
  { to: "/skills", label: "Навички", icon: GraduationCap },
  { to: "/market", label: "Магазин", icon: ShoppingBag },
  { to: "/settings", label: "Опції", icon: Settings },
] as const;

export function BottomNav() {
  const loc = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-background/90 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-6 max-w-xl mx-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = loc.pathname === tab.to;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 transition-all tap-target ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-10 h-10 rounded-2xl transition-all ${
                  active ? "bg-primary/15 shadow-glow-primary scale-110" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-medium ${active ? "text-primary" : ""}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
