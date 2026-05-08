"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, X, Save } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export default function PreferencesPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [keywords, setKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState("")
  const [locations, setLocations] = useState<string[]>([])
  const [newLocation, setNewLocation] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("any")
  const [jobType, setJobType] = useState("any")
  const [instantAlerts, setInstantAlerts] = useState(true)

  useEffect(() => {
    fetch("/api/user/preferences")
      .then((r) => r.json())
      .then((data) => {
        setKeywords(data.keywords || [])
        setLocations(data.locations || [])
        setExperienceLevel(data.experienceLevel || "any")
        setJobType(data.jobType || "any")
        setInstantAlerts(data.instantAlerts ?? true)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const addKeyword = () => {
    const kw = newKeyword.trim()
    if (kw && !keywords.includes(kw)) {
      setKeywords([...keywords, kw])
      setNewKeyword("")
    }
  }

  const removeKeyword = (k: string) => setKeywords(keywords.filter((x) => x !== k))

  const addLocation = () => {
    const loc = newLocation.trim()
    if (loc && !locations.includes(loc)) {
      setLocations([...locations, loc])
      setNewLocation("")
    }
  }

  const removeLocation = (l: string) => setLocations(locations.filter((x) => x !== l))

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, locations, experienceLevel, jobType, instantAlerts }),
      })
      if (res.ok) {
        toast.success("Preferences saved! Your scraper will use these keywords.")
      } else {
        toast.error("Failed to save preferences.")
      }
    } catch {
      toast.error("Network error.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Preferences" description="Customize your job matching criteria" />
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header title="Preferences" description="Customize your job matching criteria and notification settings" />

      <div className="p-6">
        <div className="max-w-2xl space-y-8">
          {/* Role Keywords */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-1">Role Keywords</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The scraper will look for job links containing these keywords. Add anything you want to track.
            </p>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="e.g., MTO, Data Engineer, Analyst"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addKeyword()}
              />
              <Button onClick={addKeyword} size="icon"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.length === 0 && <p className="text-sm text-muted-foreground">No keywords set.</p>}
              {keywords.map((kw) => (
                <Badge key={kw} variant="secondary" className="flex items-center gap-1 py-1.5">
                  {kw}
                  <button onClick={() => removeKeyword(kw)} className="ml-1 hover:text-destructive transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Preferred Locations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-1">Preferred Locations</h3>
            <p className="text-sm text-muted-foreground mb-4">Scraper will prioritize links/pages that mention these locations.</p>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="e.g., Dhaka, Remote"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLocation()}
              />
              <Button onClick={addLocation} size="icon"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {locations.length === 0 && <p className="text-sm text-muted-foreground">No locations set.</p>}
              {locations.map((loc) => (
                <Badge key={loc} variant="secondary" className="flex items-center gap-1 py-1.5">
                  {loc}
                  <button onClick={() => removeLocation(loc)} className="ml-1 hover:text-destructive transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Job Criteria */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Job Criteria</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Experience level and job type are included in scrape matching alongside role keywords.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead / Manager</SelectItem>
                    <SelectItem value="any">Any Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="any">Any Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Alerts */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Notification Settings</h3>
            <div className="flex items-center justify-between">
              <div>
                <Label>Instant Telegram Alerts</Label>
                <p className="text-sm text-muted-foreground">Get a Telegram message the moment a new job is found.</p>
              </div>
              <Switch checked={instantAlerts} onCheckedChange={setInstantAlerts} />
            </div>
          </motion.div>

          {/* Save */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Preferences"}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
