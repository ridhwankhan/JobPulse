import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, Check, Copy, ExternalLink, Send } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/telegram")({
  head: () => ({ meta: [{ title: "Connect Telegram — JobPulse" }, { name: "description", content: "Link your Telegram account to receive job alerts." }] }),
  component: Telegram,
});

function Telegram() {
  const [connected, setConnected] = useState(false);
  const code = "JP-" + Math.random().toString(36).slice(2, 8).toUpperCase();

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6 shadow-glow animate-glow-pulse">
            <Bot className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Connect Telegram</h1>
          <p className="text-muted-foreground">Receive instant job alerts on your phone</p>
        </div>

        {!connected ? (
          <Card className="glass p-8 border-0 space-y-6">
            <Step n={1} title="Open the JobPulse Bot">
              <Button asChild className="gradient-bg shadow-glow">
                <a href="https://t.me/JobPulseBot" target="_blank" rel="noopener noreferrer">
                  Open @JobPulseBot <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </Step>

            <Step n={2} title="Send this verification code">
              <div className="flex items-center gap-2 p-4 bg-secondary/50 rounded-xl">
                <code className="flex-1 font-mono text-lg gradient-text font-bold">{code}</code>
                <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(code); toast.success("Copied"); }}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </Step>

            <Step n={3} title="Confirm connection">
              <Button variant="outline" onClick={() => { setConnected(true); toast.success("Telegram connected!"); }}>
                <Send className="w-4 h-4 mr-2" /> I've sent the code
              </Button>
            </Step>
          </Card>
        ) : (
          <Card className="glass p-8 border-0 text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Connected ✨</h2>
            <p className="text-muted-foreground mb-6">You'll start receiving job alerts on Telegram</p>
            <Button variant="outline" onClick={() => setConnected(false)}>Disconnect</Button>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-bold shrink-0">{n}</div>
      <div className="flex-1">
        <h3 className="font-semibold mb-3">{title}</h3>
        {children}
      </div>
    </div>
  );
}
