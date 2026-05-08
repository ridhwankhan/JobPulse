"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, SlidersHorizontal } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { JobCard } from "@/components/dashboard/job-card"
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

const allJobs = [
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
  {
    title: "Frontend Developer",
    company: "Netflix",
    location: "Los Gatos, CA",
    postedAt: "3 days ago",
    type: "Full-time",
    applyUrl: "https://jobs.netflix.com",
    isNew: false,
  },
  {
    title: "Machine Learning Engineer",
    company: "OpenAI",
    location: "San Francisco, CA",
    postedAt: "1 day ago",
    type: "Full-time",
    applyUrl: "https://openai.com/careers",
    isNew: true,
  },
  {
    title: "Backend Developer",
    company: "Stripe",
    location: "Remote",
    postedAt: "4 hours ago",
    type: "Full-time",
    applyUrl: "https://stripe.com/jobs",
    isNew: true,
  },
  {
    title: "DevOps Engineer",
    company: "Amazon",
    location: "Seattle, WA",
    postedAt: "2 days ago",
    type: "Full-time",
    applyUrl: "https://amazon.jobs",
    isNew: false,
  },
  {
    title: "iOS Developer",
    company: "Airbnb",
    location: "San Francisco, CA",
    postedAt: "1 week ago",
    type: "Full-time",
    applyUrl: "https://careers.airbnb.com",
    isNew: false,
  },
  {
    title: "Security Engineer",
    company: "Cloudflare",
    location: "Austin, TX",
    postedAt: "3 days ago",
    type: "Full-time",
    applyUrl: "https://www.cloudflare.com/careers",
    isNew: false,
  },
]

const filters = ["All", "New", "Remote", "Full-time", "Part-time", "Contract"]

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [sortBy, setSortBy] = useState("recent")

  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "New" && job.isNew) ||
      (activeFilter === "Remote" && job.location.toLowerCase() === "remote") ||
      job.type.toLowerCase() === activeFilter.toLowerCase()

    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen">
      <Header
        title="Job Alerts"
        description="Browse all job listings from your tracked URLs"
      />

      <div className="p-6 space-y-6">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search jobs, companies, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
              className={`cursor-pointer transition-all ${
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary/80"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </Badge>
          ))}
        </motion.div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredJobs.length} of {allJobs.length} jobs
        </p>

        {/* Jobs Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredJobs.map((job, index) => (
            <JobCard key={index} {...job} delay={index * 0.05} />
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <Filter className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No jobs found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
