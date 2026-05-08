import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, Link2, Bell, Bot, TrendingUp, Plus, ArrowRight, Activity } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — JobPulse" }, { name: "description", content: "Your job tracking dashboard." }] }),
  component: Dashboard,
});

function StatCard({ icon: Icon, label, value, trend }: any) {
  return (
    <Card className="glass p-6 hover-lift border-0">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && <p className="text-xs text-success mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {trend}</p>}
        </div>
        <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>
    </Card>
  );
}

function Dashboard() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back 👋</h1>
            <p className="text-muted-foreground">Here's what's happening with your job tracking</p>
          </div>
          <Link to="/sources">
            <Button className="gradient-bg shadow-glow">
              <Plus className="w-4 h-4 mr-2" /> Add Source
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard icon={Link2} label="Tracked Sources" value="12" trend="+2 this week" />
          <StatCard icon={Briefcase} label="Jobs Found" value="248" trend="+18 today" />
          <StatCard icon={Bell} label="Alerts Sent" value="156" />
          <StatCard icon={Activity} label="Active Scrapers" value="12" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="glass p-6 lg:col-span-2 border-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Jobs</h2>
              <Link to="/jobs"><Button variant="ghost" size="sm">View all <ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
            </div>
            <div className="space-y-3">
              {[
                { co: "Unilever", role: "Management Trainee", loc: "Dhaka", time: "2h ago" },
                { co: "bKash", role: "Senior Data Analyst", loc: "Remote", time: "5h ago" },
                { co: "Grameenphone", role: "AI Engineer", loc: "Dhaka", time: "1d ago" },
                { co: "Shopify", role: "Frontend Developer", loc: "Remote", time: "1d ago" },
              ].map((j, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-all hover-lift">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center text-primary-foreground font-bold">
                      {j.co[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{j.role}</p>
                      <p className="text-xs text-muted-foreground">{j.co} • {j.loc}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{j.time}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="glass p-6 border-0">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/sources"><Button variant="outline" className="w-full justify-start"><Link2 className="w-4 h-4 mr-2" /> Manage Sources</Button></Link>
              <Link to="/preferences"><Button variant="outline" className="w-full justify-start"><Bell className="w-4 h-4 mr-2" /> Edit Filters</Button></Link>
              <Link to="/telegram"><Button variant="outline" className="w-full justify-start"><Bot className="w-4 h-4 mr-2" /> Connect Telegram</Button></Link>
              <Link to="/jobs"><Button variant="outline" className="w-full justify-start"><Briefcase className="w-4 h-4 mr-2" /> Browse Jobs</Button></Link>
            </div>

            <div className="mt-6 p-4 rounded-xl gradient-bg">
              <p className="text-sm font-semibold text-primary-foreground mb-1">🚀 Pro tip</p>
              <p className="text-xs text-primary-foreground/80">Connect Telegram to get instant alerts on every new job found.</p>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
