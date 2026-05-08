import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Building2, Clock, ExternalLink, Filter } from "lucide-react";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Jobs — JobPulse" }, { name: "description", content: "All jobs detected across your tracked sources." }] }),
  component: Jobs,
});

const JOBS = [
  { id: 1, title: "Management Trainee Officer", co: "Unilever", loc: "Dhaka", time: "2h ago", tags: ["Full-time", "Entry"], url: "#" },
  { id: 2, title: "Senior Data Analyst", co: "bKash", loc: "Remote", time: "5h ago", tags: ["Senior", "Remote"], url: "#" },
  { id: 3, title: "AI Engineer", co: "Grameenphone", loc: "Dhaka", time: "1d ago", tags: ["AI", "Mid-level"], url: "#" },
  { id: 4, title: "Frontend Developer", co: "Shopify", loc: "Remote", time: "1d ago", tags: ["React", "Remote"], url: "#" },
  { id: 5, title: "Product Manager", co: "Pathao", loc: "Dhaka", time: "2d ago", tags: ["PM"], url: "#" },
  { id: 6, title: "DevOps Engineer", co: "Robi", loc: "Dhaka", time: "2d ago", tags: ["Cloud"], url: "#" },
  { id: 7, title: "Marketing Lead", co: "Daraz", loc: "Dhaka", time: "3d ago", tags: ["Marketing"], url: "#" },
  { id: 8, title: "Backend Developer", co: "Chaldal", loc: "Remote", time: "3d ago", tags: ["Node", "Go"], url: "#" },
];

function Jobs() {
  const [q, setQ] = useState("");
  const filtered = JOBS.filter(j =>
    [j.title, j.co, j.loc].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Jobs</h1>
          <p className="text-muted-foreground">{filtered.length} matching opportunities</p>
        </div>

        <Card className="glass p-4 mb-6 border-0 flex gap-2 items-center">
          <Search className="w-5 h-5 text-muted-foreground ml-2" />
          <Input
            placeholder="Search by role, company or location..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0"
          />
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((j, i) => (
            <Card key={j.id} className="glass p-6 border-0 hover-lift animate-fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                  {j.co[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1">{j.title}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {j.co}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {j.loc}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {j.time}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {j.tags.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                  </div>
                  <Button size="sm" className="gradient-bg shadow-glow" asChild>
                    <a href={j.url}>Apply <ExternalLink className="w-3 h-3 ml-2" /></a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
