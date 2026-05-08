"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Send,
  CheckCircle2,
  Copy,
  ExternalLink,
  RefreshCw,
  Unlink,
  MessageCircle,
  Bell,
  Zap,
  HelpCircle,
} from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export default function TelegramPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [chatId, setChatId] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [inputChatId, setInputChatId] = useState("")

  // Load current state on mount
  useEffect(() => {
    fetch("/api/user/telegram")
      .then((r) => r.json())
      .then((data) => {
        if (data.telegramChatId) {
          setChatId(data.telegramChatId)
          setIsConnected(true)
        }
      })
      .catch(() => {})
  }, [])

  const handleSaveChatId = async () => {
    if (!inputChatId.trim()) {
      toast.error("Please enter your Telegram Chat ID")
      return
    }
    setIsSaving(true)
    try {
      const res = await fetch("/api/user/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramChatId: inputChatId.trim() }),
      })
      if (res.ok) {
        setChatId(inputChatId.trim())
        setIsConnected(true)
        setDialogOpen(false)
        toast.success("Telegram connected! You will now receive job alerts.")
      } else {
        toast.error("Failed to save. Please try again.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDisconnect = async () => {
    await fetch("/api/user/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramChatId: "" }),
    })
    setIsConnected(false)
    setChatId("")
    setInputChatId("")
    toast.success("Telegram disconnected")
  }

  const handleSendTest = async () => {
    const res = await fetch("/api/telegram/test", { method: "POST" })
    const data = await res.json()
    if (res.ok) {
      toast.success("Test alert sent! Check your Telegram app now.")
    } else {
      toast.error(data.error || "Failed to send test alert.")
    }
  }

  const copyBotLink = () => {
    navigator.clipboard.writeText("https://t.me/userinfobot")
    toast.success("Link copied to clipboard")
  }

  const features = [
    {
      icon: Zap,
      title: "Instant Alerts",
      description: "Get notified within seconds when new jobs are found",
    },
    {
      icon: MessageCircle,
      title: "Rich Messages",
      description: "Job details with direct apply links in every message",
    },
    {
      icon: Bell,
      title: "Per-User Alerts",
      description: "Each account gets alerts sent to their own Telegram",
    },
  ]

  return (
    <div className="min-h-screen">
      <Header
        title="Telegram Integration"
        description="Connect your Telegram account to receive instant job alerts"
      />

      <div className="p-6">
        <div className="max-w-2xl space-y-6">
          {/* Connection Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#229ED9]/10">
                <Send className="h-7 w-7 text-[#229ED9]" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Telegram Bot
                  </h3>
                  {isConnected ? (
                    <Badge className="bg-primary/20 text-primary">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Not Connected</Badge>
                  )}
                </div>

                {isConnected ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your Chat ID <span className="font-mono font-semibold text-foreground">{chatId}</span> is linked.
                    Job alerts will be sent directly to your Telegram.
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Connect your Telegram account to receive instant job notifications.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {isConnected ? (
                <>
                  <Button onClick={handleSendTest}>
                    <Send className="mr-2 h-4 w-4" />
                    Send Test Alert
                  </Button>
                  <Button variant="outline" onClick={handleDisconnect}>
                    <Unlink className="mr-2 h-4 w-4" />
                    Disconnect
                  </Button>
                </>
              ) : (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#229ED9] hover:bg-[#1a8ac4]">
                      <Send className="mr-2 h-4 w-4" />
                      Connect Telegram
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Send className="h-5 w-5 text-[#229ED9]" />
                        Connect Your Telegram
                      </DialogTitle>
                      <DialogDescription asChild>
                        <div className="space-y-3 text-sm text-muted-foreground">
                          <p>Follow these steps to get your Telegram Chat ID:</p>
                          <ol className="list-none space-y-3">
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-bold">1</span>
                              <span>Open Telegram and search for <strong className="text-foreground">@userinfobot</strong></span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-bold">2</span>
                              <span>Start the chat and it will instantly reply with your <strong className="text-foreground">Id:</strong> number (e.g. <code className="rounded bg-secondary px-1">123456789</code>)</span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-bold">3</span>
                              <span>Also start a chat with our bot <strong className="text-foreground">@job_pulse_notification_bot</strong> and click <strong className="text-foreground">Start</strong></span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-bold">4</span>
                              <span>Paste your ID number below and click Save</span>
                            </li>
                          </ol>
                          <a
                            href="https://t.me/userinfobot"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#229ED9] hover:underline"
                          >
                            Open @userinfobot <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                      <Label htmlFor="chat-id">Your Telegram Chat ID</Label>
                      <Input
                        id="chat-id"
                        placeholder="e.g. 123456789"
                        value={inputChatId}
                        onChange={(e) => setInputChatId(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveChatId()}
                      />
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <HelpCircle className="h-3 w-3" />
                        This is your personal Telegram numeric ID, not your username.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveChatId}
                        disabled={isSaving}
                        className="bg-[#229ED9] hover:bg-[#1a8ac4]"
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save & Connect"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Why Connect Telegram?
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="mt-3 font-medium text-foreground">
                    {feature.title}
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Example Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Sample Alert Message
            </h3>
            <div className="rounded-lg bg-[#229ED9]/5 border border-[#229ED9]/20 p-4 font-mono text-sm">
              <p className="text-foreground">🚨 <strong>NEW JOB FOUND</strong> 🚨</p>
              <p className="mt-2 text-muted-foreground">
                <strong>Company:</strong> Google
              </p>
              <p className="text-muted-foreground">
                <strong>Role:</strong> Software Engineer – MTO Programme
              </p>
              <p className="mt-2 text-[#229ED9]">
                🔗 Apply Here → https://careers.google.com/...
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
