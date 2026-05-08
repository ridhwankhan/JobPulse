"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Trash2, Globe, CheckCircle2, RefreshCw,
  ExternalLink, Building2, Pencil, X, Play, Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { addTrackedUrl, deleteTrackedUrl, updateTrackedUrl } from "@/app/actions/url"

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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editUrl, setEditUrl] = useState("")
  const [editCompany, setEditCompany] = useState("")
  const [scrapingId, setScrapingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // ── Auto-scrape a specific page after add/edit ─────────────────────────────
  const autoScrape = async (pageId: string, companyName: string) => {
    setScrapingId(pageId)
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId }),
      })
      const data = await res.json()
      if (res.ok) {
        if (data.newJobs > 0) {
          toast.success(`Found ${data.newJobs} new job(s) at ${companyName}! Check Telegram.`)
        } else {
          toast.info(`Scrape complete for ${companyName} — no new jobs yet.`)
        }
        // Update lastScraped locally
        setPages((prev) =>
          prev.map((p) =>
            p.id === pageId ? { ...p, lastScraped: new Date() } : p
          )
        )
      }
    } catch {
      toast.error("Auto-scrape failed — you can trigger it manually later.")
    } finally {
      setScrapingId(null)
    }
  }

  // ── Add URL ────────────────────────────────────────────────────────────────
  const handleAddUrl = () => {
    if (!newUrl.trim()) return toast.error("Please enter a URL")
    if (!newCompany.trim()) return toast.error("Please enter a company name")
    if (!newUrl.startsWith("http://") && !newUrl.startsWith("https://"))
      return toast.error("URL must start with http:// or https://")

    startTransition(async () => {
      const result = await addTrackedUrl(newUrl.trim(), newCompany.trim())
      if (result?.error) return toast.error(result.error)

      if (result?.page) {
        const newPage = result.page as TrackedPage
        setPages((prev) => [newPage, ...prev])
        setNewUrl("")
        setNewCompany("")
        setIsAdding(false)
        toast.success(`${newPage.companyName} added! Starting scrape...`)
        autoScrape(newPage.id, newPage.companyName)
      }
    })
  }

  // ── Edit URL ───────────────────────────────────────────────────────────────
  const startEdit = (page: TrackedPage) => {
    setEditingId(page.id)
    setEditUrl(page.url)
    setEditCompany(page.companyName)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditUrl("")
    setEditCompany("")
  }

  const handleSaveEdit = (id: string) => {
    if (!editUrl.trim()) return toast.error("URL cannot be empty")
    if (!editCompany.trim()) return toast.error("Company name cannot be empty")

    startTransition(async () => {
      const result = await updateTrackedUrl(id, editUrl.trim(), editCompany.trim())
      if (result?.error) return toast.error(result.error)

      if (result?.page) {
        const updated = result.page as TrackedPage
        setPages((prev) => prev.map((p) => (p.id === id ? updated : p)))
        cancelEdit()
        toast.success(`Updated! Re-scraping ${updated.companyName}...`)
        autoScrape(updated.id, updated.companyName)
      }
    })
  }

  // ── Delete URL ─────────────────────────────────────────────────────────────
  const handleDeleteUrl = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id))
    startTransition(async () => {
      const result = await deleteTrackedUrl(id)
      if (result?.error) toast.error(result.error)
      else toast.success("URL removed from tracking")
    })
  }

  // ── Manual scrape one URL ──────────────────────────────────────────────────
  const handleManualScrape = (page: TrackedPage) => {
    toast.info(`Scraping ${page.companyName}...`)
    autoScrape(page.id, page.companyName)
  }

  const formatLastScanned = (date: Date | null) => {
    if (!date) return "Never scanned"
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 2) return "Just now"
    if (mins < 60) return `${mins} mins ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
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
              <Input
                placeholder="Company name (e.g. Grameenphone)"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                autoFocus
                disabled={isPending}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="https://careers.company.com/jobs"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
                  disabled={isPending}
                  className="flex-1"
                />
                <Button onClick={handleAddUrl} disabled={isPending}>
                  {isPending ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Add
                </Button>
                <Button variant="ghost" onClick={() => { setIsAdding(false); setNewUrl(""); setNewCompany("") }} disabled={isPending}>
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button onClick={() => setIsAdding(true)} className="w-full">
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
          <p className="mt-1 text-xs text-muted-foreground/60">Add a career page URL to start monitoring jobs</p>
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
              transition={{ duration: 0.25, delay: index * 0.04 }}
              className="rounded-xl border border-border bg-card transition-all hover:border-primary/40"
            >
              {editingId === page.id ? (
                /* ── Edit Mode ── */
                <div className="flex flex-col gap-3 p-4">
                  <Input
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    placeholder="Company name"
                    autoFocus
                    disabled={isPending}
                  />
                  <div className="flex gap-2">
                    <Input
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      placeholder="https://..."
                      onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(page.id)}
                      disabled={isPending}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={() => handleSaveEdit(page.id)} disabled={isPending}>
                      <Check className="mr-1 h-4 w-4" />
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEdit} disabled={isPending}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                /* ── View Mode ── */
                <div className="group flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    {scrapingId === page.id ? (
                      <RefreshCw className="h-5 w-5 text-primary animate-spin" />
                    ) : (
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-foreground">{page.companyName}</p>
                      <Badge variant="secondary" className="bg-primary/10 text-primary shrink-0 text-xs">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate">{page.url}</span>
                      <a href={page.url} target="_blank" rel="noopener noreferrer"
                        className="shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="h-3 w-3 hover:text-primary" />
                      </a>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground/60">
                      Last scanned: {formatLastScanned(page.lastScraped)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => handleManualScrape(page)}
                      disabled={scrapingId === page.id}
                      title="Scrape now"
                    >
                      <Play className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => startEdit(page)}
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteUrl(page.id)}
                      disabled={isPending}
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
