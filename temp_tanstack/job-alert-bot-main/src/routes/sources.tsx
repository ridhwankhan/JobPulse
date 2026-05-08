import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ExternalLink, Link2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/sources")({
  head: () => ({ meta: [{ title: "Sources — JobPulse" }, { name: "description", content: "Manage tracked career portal URLs." }] }),
  component: Sources,
});

interface Source { id: string; url: string; name: string; status: "active" | "paused"; jobs: number; }

function Sources() {
  const [url, setUrl] = useState("");
  const [sources, setSources] = useState<Source[]>([
    { id: "1", url: "https://jobs.lever.co/unilever", name: "Unilever Careers", status: "active", jobs: 23 },
    { id: "2", url: "https://careers.bkash.com", name: "bKash", status: "active", jobs: 12 },
    { id: "3", url: "https://grameenphone.com/careers", name: "Grameenphone", status: "paused", jobs: 8 },
  ]);

  const add = () => {
    if (!url.trim()) return toast.error("Enter a valid URL");
    try { new URL(url); } catch { return toast.error("Invalid URL"); }
    const name = new URL(url).hostname.replace("www.", "");
    setSources([{ id: Date.now().toString(), url, name, status: "active", jobs: 0 }, ...sources]);
    setUrl("");
    toast.success("Source added — first scrape starting");
  };

  const remove = (id: string) => {
    setSources(sources.filter(s => s.id !== id));
    toast.success("Source removed");
  };

  const toggle = (id: string) => {
    setSources(sources.map(s => s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" } : s));
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Job Sources</h1>
          <p className="text-muted-foreground">Add career portal URLs to start tracking</p>
        </div>

        <Card className="glass p-6 mb-8 border-0">
          <div className="flex gap-2 flex-col sm:flex-row">
            <Input
              placeholder="https://jobs.lever.co/your-company"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              className="bg-input/50"
            />
            <Button onClick={add} className="gradient-bg shadow-glow">
              <Plus className="w-4 h-4 mr-2" /> Add Source
            </Button>
          </div>
        </Card>

        <div className="space-y-3">
          {sources.map((s, i) => (
            <Card key={s.id} className="glass p-5 border-0 hover-lift animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center shrink-0">
                    <Link2 className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{s.name}</p>
                      <Badge variant={s.status === "active" ? "default" : "secondary"} className={s.status === "active" ? "bg-success text-success-foreground" : ""}>
                        {s.status}
                      </Badge>
                    </div>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary truncate flex items-center gap-1">
                      {s.url} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{s.jobs} jobs</Badge>
                  <Button size="sm" variant="ghost" onClick={() => toast.success("Re-scraping...")}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toggle(s.id)}>
                    {s.status === "active" ? "Pause" : "Resume"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(s.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {sources.length === 0 && (
            <Card className="glass p-12 text-center border-0">
              <p className="text-muted-foreground">No sources yet. Add your first career page above.</p>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
