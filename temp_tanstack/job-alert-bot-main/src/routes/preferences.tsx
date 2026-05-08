import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/preferences")({
  head: () => ({ meta: [{ title: "Preferences — JobPulse" }, { name: "description", content: "Configure job filters and alert preferences." }] }),
  component: Preferences,
});

function Preferences() {
  const [keywords, setKeywords] = useState(["AI", "Data Analyst", "Frontend"]);
  const [locations, setLocations] = useState(["Dhaka", "Remote"]);
  const [kw, setKw] = useState("");
  const [loc, setLoc] = useState("");
  const [instant, setInstant] = useState(true);
  const [daily, setDaily] = useState(false);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Preferences</h1>
          <p className="text-muted-foreground">Tune what you get notified about</p>
        </div>

        <Card className="glass p-6 mb-6 border-0">
          <h2 className="text-xl font-bold mb-4">Keywords</h2>
          <p className="text-sm text-muted-foreground mb-4">Only alert me when a job title matches these keywords</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {keywords.map(k => (
              <Badge key={k} className="gradient-bg text-primary-foreground gap-1 pr-1 py-1 text-sm">
                {k}
                <button onClick={() => setKeywords(keywords.filter(x => x !== k))} className="ml-1 hover:bg-white/20 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={kw} onChange={(e) => setKw(e.target.value)} placeholder="e.g. Machine Learning" onKeyDown={(e) => {
              if (e.key === "Enter" && kw.trim()) { setKeywords([...keywords, kw.trim()]); setKw(""); }
            }} />
            <Button variant="outline" onClick={() => { if (kw.trim()) { setKeywords([...keywords, kw.trim()]); setKw(""); } }}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        <Card className="glass p-6 mb-6 border-0">
          <h2 className="text-xl font-bold mb-4">Locations</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {locations.map(l => (
              <Badge key={l} variant="secondary" className="gap-1 pr-1 py-1 text-sm">
                {l}
                <button onClick={() => setLocations(locations.filter(x => x !== l))} className="ml-1 hover:bg-white/20 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="e.g. Singapore" onKeyDown={(e) => {
              if (e.key === "Enter" && loc.trim()) { setLocations([...locations, loc.trim()]); setLoc(""); }
            }} />
            <Button variant="outline" onClick={() => { if (loc.trim()) { setLocations([...locations, loc.trim()]); setLoc(""); } }}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        <Card className="glass p-6 mb-6 border-0 space-y-4">
          <h2 className="text-xl font-bold">Notifications</h2>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Instant alerts</Label>
              <p className="text-sm text-muted-foreground">Send Telegram message as soon as a new job is found</p>
            </div>
            <Switch checked={instant} onCheckedChange={setInstant} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Daily digest</Label>
              <p className="text-sm text-muted-foreground">Summary of all new jobs at 9am</p>
            </div>
            <Switch checked={daily} onCheckedChange={setDaily} />
          </div>
        </Card>

        <Button className="gradient-bg shadow-glow w-full" onClick={() => toast.success("Preferences saved")}>
          <Save className="w-4 h-4 mr-2" /> Save preferences
        </Button>
      </div>
    </AppLayout>
  );
}
