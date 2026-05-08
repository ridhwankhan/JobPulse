"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, ExternalLink, Briefcase } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Job {
  id: string
  title: string
  url: string
  createdAt: string
  trackedPage: { companyName: string; url: string }
}

const filters = ["All", "New"]

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    fetch("/api/user/jobs")
      .then((r) => r.json())
      .then((data) => { setJobs(data.jobs || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q") || ""
    setSearchQuery(q)
  }, [])

  const isNew = (createdAt: string) => {
    return Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000
  }

  const filtered = jobs
    .filter((job) => {
      const q = searchQuery.toLowerCase()
      const matchSearch =
        job.title.toLowerCase().includes(q) ||
        job.trackedPage.companyName.toLowerCase().includes(q)
      const matchFilter =
        activeFilter === "All" || (activeFilter === "New" && isNew(job.createdAt))
      return matchSearch && matchFilter
    })
    .sort((a, b) =>
      sortBy === "recent"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : a.trackedPage.companyName.localeCompare(b.trackedPage.companyName)
    )

  return (
    <div className="min-h-screen">
      <Header title="Job Alerts" description="All job listings found from your tracked URLs" />

      <div className="p-6 space-y-6">
        {/* Search and Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search jobs or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="company">Company</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Filter Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2"
        >
          {filters.map((filter) => (
            <Badge
              key={filter}
              variant={activeFilter === filter ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </Badge>
          ))}
        </motion.div>

        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {jobs.length} jobs
        </p>

        {!loading && searchQuery.trim() && filtered.length === 0 && (
          <div className="rounded-lg border border-dashed border-border bg-card p-4 text-sm text-muted-foreground">
            Nothing found for <span className="font-medium text-foreground">&quot;{searchQuery.trim()}&quot;</span> in Job Alerts.
            Add more tracked URLs from the Track URLs page to discover more results.
          </div>
        )}

        {/* Jobs List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground">
              {jobs.length === 0 ? "No jobs found yet" : "No matches for your search"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {jobs.length === 0
                ? "Add tracked URLs and run the scraper from the Overview page."
                : "Try a different search or filter."}
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground truncate">{job.title}</p>
                      {isNew(job.createdAt) && (
                        <Badge className="bg-primary/20 text-primary text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{job.trackedPage.companyName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Found {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    <a href={job.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      Apply
                    </a>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
