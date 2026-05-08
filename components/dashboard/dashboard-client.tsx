"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Link2, Briefcase, Bell, Play, Plus, ExternalLink } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { addTrackedUrl } from "@/app/actions/url"
import { toast } from "sonner"
import { TrackedJobPage, JobListing } from "@prisma/client"

type TrackedPageWithJobs = TrackedJobPage & { jobs: JobListing[] }

export function DashboardClient({
  trackedPages,
  recentJobs,
  totalJobs,
}: {
  trackedPages: TrackedJobPage[]
  recentJobs: (JobListing & { trackedPage: { companyName: string } })[]
  totalJobs: number
}) {
  const [isPending, startTransition] = useTransition()
  const [isScraping, setIsScraping] = useState(false)
  const [error, setError] = useState("")
  const [newJobsFound, setNewJobsFound] = useState<number | null>(null)

  const handleSubmit = (formData: FormData) => {
    setError("")
    startTransition(async () => {
      try {
        await addTrackedUrl(formData)
      } catch (err: any) {
        setError(err.message)
      }
    })
  }

  const handleScrapeNow = async () => {
    setIsScraping(true)
    setNewJobsFound(null)
    try {
      const res = await fetch("/api/scrape", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setNewJobsFound(data.newJobs)
        toast.success(
          data.newJobs > 0
            ? `Found ${data.newJobs} new job(s)! Check Telegram.`
            : "Scrape complete — no new jobs found."
        )
      } else {
        toast.error("Scrape failed. Try again.")
      }
    } catch {
      toast.error("Network error during scrape.")
    } finally {
      setIsScraping(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="Overview" description="Monitor your job tracking activity" />

      <div className="p-6 space-y-6">
        {/* Stats Grid — real data only */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Tracked URLs"
            value={trackedPages.length}
            change="Total pages you are watching"
            changeType="neutral"
            icon={Link2}
            delay={0}
          />
          <StatsCard
            title="Jobs Found"
            value={totalJobs}
            change="Stored in your database"
            changeType={totalJobs > 0 ? "positive" : "neutral"}
            icon={Briefcase}
            delay={0.1}
          />
          <StatsCard
            title="Recent Jobs"
            value={recentJobs.length}
            change="Found in last 10 days"
            changeType={recentJobs.length > 0 ? "positive" : "neutral"}
            icon={Bell}
            delay={0.2}
          />
        </div>

        {/* Scrape Now */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h3 className="font-semibold text-foreground">Run Scraper Now</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Check all your tracked URLs for new jobs and send Telegram alerts instantly.
            </p>
            {newJobsFound !== null && (
              <p className={`text-sm mt-1 font-medium ${newJobsFound > 0 ? "text-primary" : "text-muted-foreground"}`}>
                {newJobsFound > 0 ? `✓ ${newJobsFound} new jobs found and sent to Telegram!` : "No new jobs this time."}
              </p>
            )}
          </div>
          <Button onClick={handleScrapeNow} disabled={isScraping || trackedPages.length === 0} className="shrink-0">
            <Play className="mr-2 h-4 w-4" />
            {isScraping ? "Scanning..." : "Scrape Now"}
          </Button>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Jobs — real data from DB */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Recent Jobs</h2>
                <Link href="/dashboard/jobs" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>

              {recentJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Briefcase className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="font-medium text-foreground">No jobs found yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add tracked URLs and click &quot;Scrape Now&quot; to find jobs.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentJobs.map((job, i) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3 hover:bg-secondary/60 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{job.title}</p>
                        <p className="text-sm text-muted-foreground">{job.trackedPage.companyName}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-3 shrink-0">
                        <Badge variant="secondary" className="text-xs">New</Badge>
                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                          <a href={job.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Tracked Pages Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-border bg-card p-6 h-full"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">Tracked Companies</h2>
              {trackedPages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Link2 className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No URLs tracked yet.</p>
                  <Link href="/dashboard/urls" className="text-sm text-primary hover:underline mt-1">
                    Add your first URL →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {trackedPages.slice(0, 8).map((page) => (
                    <div key={page.id} className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2">
                      <span className="text-sm font-medium text-foreground truncate">{page.companyName}</span>
                      <a href={page.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-primary" />
                      </a>
                    </div>
                  ))}
                  {trackedPages.length > 8 && (
                    <Link href="/dashboard/urls" className="block text-xs text-primary text-center mt-2 hover:underline">
                      +{trackedPages.length - 8} more
                    </Link>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
