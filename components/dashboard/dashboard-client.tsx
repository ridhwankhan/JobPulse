"use client"

import { Link2, Briefcase, Bell, TrendingUp, Plus } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { JobCard } from "@/components/dashboard/job-card"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addTrackedUrl } from "@/app/actions/url"
import { useState, useTransition } from "react"
import { TrackedJobPage } from "@prisma/client"

export function DashboardClient({ trackedPages }: { trackedPages: TrackedJobPage[] }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

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

  const recentJobs = [
    {
      title: "Senior Software Engineer",
      company: "Google",
      location: "Mountain View, CA",
      postedAt: "2 hours ago",
      type: "Full-time",
      applyUrl: "https://careers.google.com",
      isNew: true,
    },
    {
      title: "Product Manager",
      company: "Meta",
      location: "Remote",
      postedAt: "5 hours ago",
      type: "Full-time",
      applyUrl: "https://www.metacareers.com",
      isNew: true,
    },
    {
      title: "Data Scientist",
      company: "Microsoft",
      location: "Seattle, WA",
      postedAt: "1 day ago",
      type: "Full-time",
      applyUrl: "https://careers.microsoft.com",
      isNew: false,
    },
    {
      title: "UX Designer",
      company: "Apple",
      location: "Cupertino, CA",
      postedAt: "2 days ago",
      type: "Full-time",
      applyUrl: "https://jobs.apple.com",
      isNew: false,
    },
  ]

  return (
    <div className="min-h-screen">
      <Header title="Overview" description="Monitor your job tracking activity" />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Tracked URLs"
            value={trackedPages.length}
            change="Total pages"
            changeType="neutral"
            icon={Link2}
            delay={0}
          />
          <StatsCard
            title="Jobs Found"
            value={248}
            change="+34 today"
            changeType="positive"
            icon={Briefcase}
            delay={0.1}
          />
          <StatsCard
            title="Alerts Sent"
            value={89}
            change="Last 24 hours"
            changeType="neutral"
            icon={Bell}
            delay={0.2}
          />
          <StatsCard
            title="Match Rate"
            value="67%"
            change="+5% from last week"
            changeType="positive"
            icon={TrendingUp}
            delay={0.3}
          />
        </div>

        {/* Add New Tracker Form */}
        {/* Intentionally removed. Tracker form has been moved to Track URLs page */}


        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content Grid (Recent Jobs & Tracked Pages) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Recent Jobs</h2>
                <a
                  href="/dashboard/jobs"
                  className="text-sm text-primary hover:underline"
                >
                  View all
                </a>
              </div>
              <div className="space-y-3">
                {recentJobs.map((job, index) => (
                  <JobCard key={index} {...job} delay={index * 0.1} />
                ))}
              </div>
            </div>


          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-6 h-full">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Recent Activity
              </h2>
              <ActivityFeed />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
