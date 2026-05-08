"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  Link2, 
  Settings2, 
  Bell, 
  Send,
  Briefcase,
  ChevronRight,
  Shield
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Track URLs",
    href: "/dashboard/urls",
    icon: Link2,
  },
  {
    title: "Job Alerts",
    href: "/dashboard/jobs",
    icon: Briefcase,
  },
  {
    title: "Preferences",
    href: "/dashboard/preferences",
    icon: Settings2,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Telegram",
    href: "/dashboard/telegram",
    icon: Send,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((data) => setIsAdmin(Boolean(data.isAdmin)))
      .catch(() => setIsAdmin(false))
  }, [])

  const renderedItems = isAdmin
    ? [...navItems, { title: "Admin", href: "/dashboard/admin", icon: Shield }]
    : navItems

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <Link href="/" className="flex h-16 items-center gap-2 border-b border-border px-6 hover:bg-secondary/50 transition-colors">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Briefcase className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">JobPulse</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {renderedItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
                <item.icon className="relative z-10 h-4 w-4" />
                <span className="relative z-10">{item.title}</span>
                {isActive && (
                  <ChevronRight className="relative z-10 ml-auto h-4 w-4" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-xs text-muted-foreground">
              Your tracked companies and alerts are user-specific.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Open <span className="text-foreground">Overview</span> to run a live scan.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
