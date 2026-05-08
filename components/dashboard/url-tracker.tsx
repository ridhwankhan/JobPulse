"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Trash2, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface TrackedUrl {
  id: string
  url: string
  status: "active" | "error" | "pending"
  lastScanned: string
  jobsFound: number
}

const initialUrls: TrackedUrl[] = [
  {
    id: "1",
    url: "https://jobs.lever.co/google",
    status: "active",
    lastScanned: "2 hours ago",
    jobsFound: 45,
  },
  {
    id: "2",
    url: "https://careers.microsoft.com",
    status: "active",
    lastScanned: "3 hours ago",
    jobsFound: 128,
  },
  {
    id: "3",
    url: "https://jobs.apple.com",
    status: "pending",
    lastScanned: "Scanning...",
    jobsFound: 0,
  },
  {
    id: "4",
    url: "https://amazon.jobs",
    status: "error",
    lastScanned: "Failed",
    jobsFound: 0,
  },
]

export function UrlTracker() {
  const [urls, setUrls] = useState<TrackedUrl[]>(initialUrls)
  const [newUrl, setNewUrl] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleAddUrl = () => {
    if (!newUrl.trim()) return
    
    if (!newUrl.startsWith("http://") && !newUrl.startsWith("https://")) {
      toast.error("Please enter a valid URL starting with http:// or https://")
      return
    }

    const newTrackedUrl: TrackedUrl = {
      id: Date.now().toString(),
      url: newUrl,
      status: "pending",
      lastScanned: "Scanning...",
      jobsFound: 0,
    }

    setUrls([newTrackedUrl, ...urls])
    setNewUrl("")
    setIsAdding(false)
    toast.success("URL added successfully! Scanning will begin shortly.")

    // Simulate scan completion
    setTimeout(() => {
      setUrls((prev) =>
        prev.map((u) =>
          u.id === newTrackedUrl.id
            ? { ...u, status: "active", lastScanned: "Just now", jobsFound: Math.floor(Math.random() * 50) + 1 }
            : u
        )
      )
      toast.success("Scan complete! Found new job listings.")
    }, 3000)
  }

  const handleDeleteUrl = (id: string) => {
    setUrls(urls.filter((u) => u.id !== id))
    toast.success("URL removed from tracking")
  }

  const handleRescan = (id: string) => {
    setUrls((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: "pending", lastScanned: "Scanning..." } : u
      )
    )
    toast.info("Rescanning URL...")

    setTimeout(() => {
      setUrls((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, status: "active", lastScanned: "Just now", jobsFound: u.jobsFound + Math.floor(Math.random() * 10) }
            : u
        )
      )
      toast.success("Rescan complete!")
    }, 2000)
  }

  return (
    <div className="space-y-4">
      {/* Add URL Section */}
      <AnimatePresence>
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 rounded-xl border border-border bg-card p-4">
              <Input
                placeholder="https://careers.company.com/jobs"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
                className="flex-1"
                autoFocus
              />
              <Button onClick={handleAddUrl}>Add URL</Button>
              <Button variant="ghost" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button onClick={() => setIsAdding(true)} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Career Page URL
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* URL List */}
      <div className="space-y-3">
        <AnimatePresence>
          {urls.map((url, index) => (
            <motion.div
              key={url.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Globe className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-foreground">
                    {url.url}
                  </p>
                  <a
                    href={url.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                  </a>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Last scanned: {url.lastScanned}</span>
                  {url.status === "active" && (
                    <span className="text-primary">{url.jobsFound} jobs found</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {url.status === "active" && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                )}
                {url.status === "error" && (
                  <Badge variant="destructive">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Error
                  </Badge>
                )}
                {url.status === "pending" && (
                  <Badge variant="secondary">
                    <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                    Scanning
                  </Badge>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRescan(url.id)}
                  disabled={url.status === "pending"}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteUrl(url.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
