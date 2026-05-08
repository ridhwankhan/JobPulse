import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Briefcase, Link2, Sparkles, Zap, Shield, Bell, ArrowRight, CheckCircle2, Globe, Filter, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JobPulse — AI Job Monitoring & Telegram Alerts" },
      { name: "description", content: "Track job portals, get instant Telegram alerts for new openings matching your filters. Never miss a job again." },
      { property: "og:title", content: "JobPulse — AI Job Monitoring" },
      { property: "og:description", content: "Real-time job alerts on Telegram." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-40 glass border-b">
        <div className="container mx-auto flex items-center justify-between px-4 h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg gradient-text">JobPulse</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how" className="hover:text-primary transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link to="/telegram">
              <Button className="gradient-bg shadow-glow">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 pt-24 pb-20 text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm">Live job tracking — powered by AI</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up">
          Never miss <span className="gradient-text">a job</span><br />
          opening again
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          Track any career portal. Get filtered, deduplicated job alerts straight to your Telegram in real time.
        </p>
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <Link to="/dashboard">
            <Button size="lg" className="gradient-bg shadow-glow text-base px-8">
              Start Tracking Free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/jobs">
            <Button size="lg" variant="outline" className="text-base px-8">
              View Demo Jobs
            </Button>
          </Link>
        </div>

        {/* Floating preview */}
        <div className="mt-20 max-w-3xl mx-auto animate-float">
          <div className="glass rounded-2xl p-6 shadow-elegant text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold">JobPulse Bot</p>
                <p className="text-xs text-muted-foreground">via Telegram</p>
              </div>
            </div>
            <div className="bg-secondary/40 rounded-xl p-4 space-y-2">
              <p className="font-bold text-success">🚨 New Job Found</p>
              <p><span className="text-muted-foreground">Company:</span> Unilever</p>
              <p><span className="text-muted-foreground">Role:</span> Management Trainee Officer</p>
              <p><span className="text-muted-foreground">Location:</span> Dhaka</p>
              <p className="text-primary text-sm">→ Apply Now</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">Built for <span className="gradient-text">job seekers</span></h2>
          <p className="text-muted-foreground">Everything you need to stay ahead.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Globe, title: "Universal scraping", desc: "Works on any career portal — Lever, Greenhouse, custom sites." },
            { icon: Filter, title: "Smart filters", desc: "Keywords, locations, experience level — only what you care about." },
            { icon: Bell, title: "Instant Telegram alerts", desc: "Real-time delivery to your favorite messenger." },
            { icon: Shield, title: "Zero duplicates", desc: "Fingerprint-based dedup engine. Each job notified once." },
            { icon: Zap, title: "Always-on", desc: "Background workers scrape every few hours, 24/7." },
            { icon: Sparkles, title: "AI-ready", desc: "Semantic ranking and resume matching coming soon." },
          ].map((f, i) => (
            <div key={f.title} className="glass rounded-2xl p-6 hover-lift animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How */}
      <section id="how" className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">How it <span className="gradient-text">works</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Link2, step: "01", title: "Add URLs", desc: "Paste any career page URL into your dashboard." },
            { icon: Filter, step: "02", title: "Set filters", desc: "Define keywords, roles, locations to match." },
            { icon: Send, step: "03", title: "Get alerts", desc: "Connect Telegram and receive new jobs instantly." },
          ].map((s, i) => (
            <div key={s.step} className="glass rounded-2xl p-8 hover-lift relative animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-6xl font-bold gradient-text opacity-30 absolute top-4 right-6">{s.step}</div>
              <s.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-xl mb-2">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">Simple <span className="gradient-text">pricing</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { name: "Free", price: "$0", features: ["3 URLs", "Daily scans", "Telegram alerts"], cta: "Start free" },
            { name: "Pro", price: "$9", features: ["25 URLs", "Hourly scans", "Smart filters", "Priority delivery"], cta: "Go Pro", featured: true },
            { name: "Team", price: "$29", features: ["Unlimited URLs", "Real-time scans", "AI matching", "Multi-user"], cta: "Contact us" },
          ].map((p) => (
            <div key={p.name} className={`glass rounded-2xl p-8 hover-lift ${p.featured ? "ring-2 ring-primary shadow-glow" : ""}`}>
              {p.featured && <div className="text-xs gradient-bg px-2 py-1 rounded-full inline-block mb-3 text-primary-foreground font-semibold">MOST POPULAR</div>}
              <h3 className="text-2xl font-bold">{p.name}</h3>
              <div className="my-4">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/dashboard">
                <Button className={`w-full ${p.featured ? "gradient-bg shadow-glow" : ""}`} variant={p.featured ? "default" : "outline"}>
                  {p.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="glass rounded-3xl p-12 text-center max-w-4xl mx-auto shadow-elegant animate-glow-pulse">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to land your next role?</h2>
          <p className="text-muted-foreground mb-6">Join thousands tracking jobs with JobPulse.</p>
          <Link to="/dashboard">
            <Button size="lg" className="gradient-bg shadow-glow">
              Open Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t mt-10">
        <div className="container mx-auto px-4 py-8 text-sm text-muted-foreground flex flex-col md:flex-row justify-between gap-4">
          <p>© 2026 JobPulse</p>
          <div className="flex gap-4">
            <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <Link to="/sources" className="hover:text-foreground">Sources</Link>
            <Link to="/jobs" className="hover:text-foreground">Jobs</Link>
            <Link to="/telegram" className="hover:text-foreground">Telegram</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
