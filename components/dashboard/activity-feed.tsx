"use client"

import { motion } from "framer-motion"
import { Bell, Briefcase, CheckCircle, AlertTriangle, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface Activity {
  id: string
  type: "job_found" | "notification_sent" | "scan_complete" | "error"
  title: string
  description: string
  timestamp: string
}

const activities: Activity[] = [
  {
    id: "1",
    type: "job_found",
    title: "New Job Found",
    description: "Software Engineer at Google - Mountain View, CA",
    timestamp: "2 minutes ago",
  },
  {
    id: "2",
    type: "notification_sent",
    title: "Alert Sent",
    description: "Telegram notification delivered successfully",
    timestamp: "5 minutes ago",
  },
  {
    id: "3",
    type: "scan_complete",
    title: "Scan Complete",
    description: "microsoft.com/careers - 12 new listings",
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    type: "job_found",
    title: "New Job Found",
    description: "Data Analyst at Meta - Remote",
    timestamp: "2 hours ago",
  },
  {
    id: "5",
    type: "error",
    title: "Scan Failed",
    description: "Could not access amazon.jobs - retrying",
    timestamp: "3 hours ago",
  },
  {
    id: "6",
    type: "notification_sent",
    title: "Alert Sent",
    description: "3 job alerts sent to Telegram",
    timestamp: "4 hours ago",
  },
]

const iconMap = {
  job_found: Briefcase,
  notification_sent: Send,
  scan_complete: CheckCircle,
  error: AlertTriangle,
}

const colorMap = {
  job_found: "text-primary bg-primary/10",
  notification_sent: "text-blue-400 bg-blue-400/10",
  scan_complete: "text-primary bg-primary/10",
  error: "text-destructive bg-destructive/10",
}

export function ActivityFeed() {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = iconMap[activity.type]
        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-start gap-3"
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                colorMap[activity.type]
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {activity.title}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground truncate">
                {activity.description}
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {activity.timestamp}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
