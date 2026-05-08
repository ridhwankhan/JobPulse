"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Briefcase,
  AlertCircle,
  Send,
  Filter,
} from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Notification {
  id: string
  type: "job" | "alert" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "job",
    title: "New Job Match",
    message: "Senior Software Engineer at Google matches your preferences",
    timestamp: "5 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "job",
    title: "New Job Match",
    message: "Product Manager at Meta - Remote position available",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "alert",
    title: "Telegram Connected",
    message: "Your Telegram account has been successfully linked",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: "4",
    type: "system",
    title: "Scan Complete",
    message: "Found 12 new jobs from microsoft.com/careers",
    timestamp: "3 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "job",
    title: "New Job Match",
    message: "Data Scientist at Netflix - Los Gatos, CA",
    timestamp: "5 hours ago",
    read: true,
  },
  {
    id: "6",
    type: "system",
    title: "URL Added",
    message: "Now tracking jobs.apple.com",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: "7",
    type: "alert",
    title: "Weekly Report",
    message: "Your weekly job report is ready - 45 new matches",
    timestamp: "2 days ago",
    read: true,
  },
]

const iconMap = {
  job: Briefcase,
  alert: Bell,
  system: Send,
}

const colorMap = {
  job: "bg-primary/10 text-primary",
  alert: "bg-blue-500/10 text-blue-400",
  system: "bg-secondary text-muted-foreground",
}

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast.success("All notifications marked as read")
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    toast.success("Notification deleted")
  }

  const clearAll = () => {
    setNotifications([])
    toast.success("All notifications cleared")
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Notifications"
        description="Stay updated on new jobs and system alerts"
      />

      <div className="p-6">
        <div className="max-w-3xl">
          {/* Actions Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <Badge
                variant={filter === "all" ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setFilter("all")}
              >
                All ({notifications.length})
              </Badge>
              <Badge
                variant={filter === "unread" ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setFilter("unread")}
              >
                Unread ({unreadCount})
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark all read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                disabled={notifications.length === 0}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear all
              </Button>
            </div>
          </motion.div>

          {/* Notifications List */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredNotifications.map((notification, index) => {
                const Icon = iconMap[notification.type]
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={cn(
                      "group relative flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200",
                      !notification.read && "border-primary/30 bg-primary/5"
                    )}
                  >
                    {!notification.read && (
                      <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-primary" />
                    )}

                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        colorMap[notification.type]
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-foreground">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {notification.timestamp}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markAsRead(notification.id)}
                          className="h-8 w-8"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNotification(notification.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {filteredNotifications.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground">
                  No notifications
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {filter === "unread"
                    ? "You're all caught up!"
                    : "New notifications will appear here"}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
