"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function TelegramPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")

  const botUsername = "JobPulseBot"
  const telegramLink = `https://t.me/${botUsername}`

  const handleConnect = () => {
    setIsConnecting(true)
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
      toast.success("Telegram connected successfully!")
    }, 2000)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    toast.success("Telegram disconnected")
  }

  const handleSendTest = () => {
    toast.success("Test message sent to Telegram!")
  }

  const copyBotLink = () => {
    navigator.clipboard.writeText(telegramLink)
    toast.success("Bot link copied to clipboard")
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
      title: "Custom Filters",
      description: "Only receive alerts for jobs matching your preferences",
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
                    Your Telegram account is linked. You&apos;ll receive job alerts
                    directly in your Telegram chat.
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Connect your Telegram account to receive instant job
                    notifications.
                  </p>
                )}
              </div>
            </div>

            {isConnected ? (
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={handleSendTest}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Test Message
                </Button>
                <Button variant="outline" onClick={handleDisconnect}>
                  <Unlink className="mr-2 h-4 w-4" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {/* Step 1: Open Bot */}
                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      1
                    </span>
                    Open our Telegram Bot
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Click the button below to open @{botUsername} in Telegram
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild className="bg-[#229ED9] hover:bg-[#1a8ac4]">
                      <a
                        href={telegramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Open in Telegram
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                    <Button variant="outline" onClick={copyBotLink}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Link
                    </Button>
                  </div>
                </div>

                {/* Step 2: Start Bot */}
                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      2
                    </span>
                    Start the Bot
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Click the &quot;Start&quot; button in Telegram to begin the connection
                    process
                  </p>
                </div>

                {/* Step 3: Enter Code */}
                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      3
                    </span>
                    Enter Verification Code
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    The bot will send you a verification code. Enter it below:
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Input
                      placeholder="Enter code from Telegram"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button
                      onClick={handleConnect}
                      disabled={isConnecting}
                    >
                      {isConnecting ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        "Verify & Connect"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
              <p className="text-foreground">🚨 <strong>New Job Found</strong></p>
              <p className="mt-2 text-muted-foreground">
                <strong>Company:</strong> Google
              </p>
              <p className="text-muted-foreground">
                <strong>Role:</strong> Senior Software Engineer
              </p>
              <p className="text-muted-foreground">
                <strong>Location:</strong> Mountain View, CA
              </p>
              <p className="text-muted-foreground">
                <strong>Posted:</strong> Today
              </p>
              <p className="mt-2 text-[#229ED9]">
                🔗 Apply: https://careers.google.com/...
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
