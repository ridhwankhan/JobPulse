import { Link, useRouterState } from "@tanstack/react-router";
import { Bot, LayoutDashboard, Link2, Settings, Briefcase, Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/sources", label: "Sources", icon: Link2 },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/preferences", label: "Preferences", icon: Settings },
  { to: "/telegram", label: "Telegram", icon: Bot },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 glass border-b">
        <div className="container mx-auto flex items-center justify-between px-4 h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg gradient-text">JobPulse</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((item) => {
              const active = location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link to="/telegram">
              <Button variant="default" className="gradient-bg shadow-glow hover:opacity-90">
                <Bot className="w-4 h-4 mr-2" /> Connect Bot
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t glass animate-fade-in">
            <div className="px-4 py-3 flex flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-lg flex items-center gap-3 hover:bg-secondary"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 animate-fade-in">
        {children}
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-sm text-muted-foreground flex flex-col md:flex-row justify-between gap-4">
          <p>© 2026 JobPulse — AI Job Monitoring & Telegram Alerts</p>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <Link to="/telegram" className="hover:text-foreground">Telegram</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
