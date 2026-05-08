"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Trash2, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Building2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { addTrackedUrl, deleteTrackedUrl } from "@/app/actions/url"

interface TrackedPage {
  id: string
  url: string
  companyName: string
  lastScraped: Date | null
  createdAt: Date
}

interface UrlTrackerProps {
  initialTrackedPages: TrackedPage[]
}

export function UrlTracker({ initialTrackedPages }: UrlTrackerProps) {
  const [pages, setPages] = useState<TrackedPage[]>(initialTrackedPages)
  const [newUrl, setNewUrl] = useState("")
  const [newCompany, setNewCompany] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleAddUrl = () => {
    if (!newUrl.trim()) {
      toast.error("Please enter a URL")
      return
    }
    if (!newCompany.trim()) {
      toast.error("Please enter a company name")
      return
    }
    if (!newUrl.startsWith("http://") && !newUrl.startsWith("https://")) {
      toast.error("Please enter a valid URL starting with http:// or https://")
      return
    }

    startTransition(async () => {
      const result = await addTrackedUrl(newUrl.trim(), newCompany.trim())

      if (result?.error) {
        toast.error(result.error)
        return
      }

      // Optimistic update — add the returned page to local state
      if (result?.page) {
        setPages((prev) => [result.page as TrackedPage, ...prev])
      }

      setNewUrl("")
      setNewCompany("")
      setIsAdding(false)
      toast.success("URL added and saved successfully!")
    })
  }

  const handleDeleteUrl = (id: string) => {
    // Optimistic removal
    setPages((prev) => prev.filter((p) => p.id !== id))

    startTransition(async () => {
      const result = await deleteTrackedUrl(id)
      if (result?.error) {
        toast.error(result.error)
        // Re-fetch would be ideal here; for now show the error
      } else {
        toast.success("URL removed from tracking")
      }
    })
  }

  const formatLastScanned = (date: Date | null) => {
    if (!date) return "Never scanned"
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return "Less than an hour ago"
    if (hours === 1) return "1 hour ago"
    if (hours < 24) return `${hours} hours ago`
    const days = Math.floor(hours / 24)
    return `${days} day${days > 1 ? "s" : ""} ago`
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
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Company name (e.g. Google)"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="flex-1"
                  autoFocus
                  disabled={isPending}
                />
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="https://careers.company.com/jobs"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
                  className="flex-1"
                  disabled={isPending}
                />
                <Button onClick={handleAddUrl} disabled={isPending}>
                  {isPending ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Add URL
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsAdding(false)
                    setNewUrl("")
                    setNewCompany("")
                  }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button
              onClick={() => setIsAdding(true)}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Career Page URL
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {pages.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
          <Globe className="mb-4 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">No URLs tracked yet</p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Add your first career page URL above to start monitoring
          </p>
        </div>
      )}

      {/* URL List */}
      <div className="space-y-3">
        <AnimatePresence>
          {pages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-foreground">
                    {page.companyName}
                  </p>
                  <Badge variant="secondary" className="bg-primary/10 text-primary shrink-0">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="truncate">{page.url}</span>
                  <a
                    href={page.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <ExternalLink className="h-3 w-3 hover:text-primary" />
                  </a>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground/60">
                  Last scanned: {formatLastScanned(page.lastScraped)}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteUrl(page.id)}
                disabled={isPending}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
