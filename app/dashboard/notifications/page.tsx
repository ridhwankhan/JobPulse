"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, ExternalLink, Briefcase, Trash2, RefreshCw } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Job {
  id: string
  title: string
  url: string
  createdAt: string
  trackedPage: { companyName: string }
}

export default function NotificationsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "new">("all")
  const [isScraping, setIsScraping] = useState(false)

  const loadJobs = () => {
    setLoading(true)
    fetch("/api/user/jobs")
      .then((r) => r.json())
      .then((data) => { setJobs(data.jobs || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { loadJobs() }, [])

  const isNew = (createdAt: string) =>
    Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000

  const handleScrapeNow = async () => {
    setIsScraping(true)
    try {
      const res = await fetch("/api/scrape", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        toast.success(
          data.newJobs > 0
            ? `Found ${data.newJobs} new job(s)! Refreshing...`
            : "No new jobs found."
        )
        if (data.newJobs > 0) loadJobs()
      } else {
        toast.error("Scrape failed.")
      }
    } catch {
      toast.error("Network error.")
    } finally {
      setIsScraping(false)
    }
  }

  const newCount = jobs.filter((j) => isNew(j.createdAt)).length
  const filtered = filter === "new" ? jobs.filter((j) => isNew(j.createdAt)) : jobs

  return (
    <div className="min-h-screen">
      <Header title="Notifications" description="Real-time job alerts from your tracked URLs" />

      <div className="p-6">
        <div className="max-w-3xl space-y-6">
          {/* Actions Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <Badge
                variant={filter === "all" ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setFilter("all")}
              >
                All ({jobs.length})
              </Badge>
              <Badge
                variant={filter === "new" ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setFilter("new")}
              >
                Today ({newCount})
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={loadJobs} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button size="sm" onClick={handleScrapeNow} disabled={isScraping}>
                {isScraping ? "Scanning..." : "Scrape Now"}
              </Button>
            </div>
          </motion.div>

          {/* Job List */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No notifications yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {jobs.length === 0
                  ? "Add tracked URLs and run the scraper to start getting alerts."
                  : "No jobs found today. Click Scrape Now to check."}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filtered.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ delay: i * 0.04 }}
                    className={`group relative flex items-start gap-4 rounded-xl border bg-card p-4 transition-all ${
                      isNew(job.createdAt) ? "border-primary/30 bg-primary/5" : "border-border"
                    }`}
                  >
                    {isNew(job.createdAt) && (
                      <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-primary" />
                    )}

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-foreground">{job.title}</p>
                            {isNew(job.createdAt) && (
                              <Badge className="bg-primary/20 text-primary text-xs">New Today</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {job.trackedPage.companyName}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                      asChild
                    >
                      <a href={job.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
