"use client"

import { useState } from "react"
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
  const [keywords, setKeywords] = useState([
    "Software Engineer",
    "Data Analyst",
    "Product Manager",
    "UX Designer",
  ])
  const [newKeyword, setNewKeyword] = useState("")
  const [locations, setLocations] = useState([
    "Remote",
    "San Francisco, CA",
    "New York, NY",
  ])
  const [newLocation, setNewLocation] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("mid")
  const [jobType, setJobType] = useState("full-time")
  const [notifications, setNotifications] = useState({
    instant: true,
    daily: false,
    weekly: true,
  })

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()])
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword))
  }

  const addLocation = () => {
    if (newLocation.trim() && !locations.includes(newLocation.trim())) {
      setLocations([...locations, newLocation.trim()])
      setNewLocation("")
    }
  }

  const removeLocation = (location: string) => {
    setLocations(locations.filter((l) => l !== location))
  }

  const handleSave = () => {
    toast.success("Preferences saved successfully!")
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Preferences"
        description="Customize your job matching criteria and notification settings"
      />

      <div className="p-6">
        <div className="max-w-2xl space-y-8">
          {/* Role Keywords */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Role Keywords
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add keywords to match job titles you&apos;re interested in
            </p>

            <div className="flex gap-2 mb-4">
              <Input
                placeholder="e.g., Frontend Developer"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addKeyword()}
              />
              <Button onClick={addKeyword} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="flex items-center gap-1 py-1.5"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="ml-1 hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Locations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Preferred Locations
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Specify locations you&apos;d like to work in
            </p>

            <div className="flex gap-2 mb-4">
              <Input
                placeholder="e.g., Austin, TX"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLocation()}
              />
              <Button onClick={addLocation} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {locations.map((location) => (
                <Badge
                  key={location}
                  variant="secondary"
                  className="flex items-center gap-1 py-1.5"
                >
                  {location}
                  <button
                    onClick={() => removeLocation(location)}
                    className="ml-1 hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Experience & Job Type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Job Criteria
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Notification Frequency
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Instant Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified immediately when new jobs are found
                  </p>
                </div>
                <Switch
                  checked={notifications.instant}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, instant: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Daily Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a summary of new jobs every day
                  </p>
                </div>
                <Switch
                  checked={notifications.daily}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, daily: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Weekly Report</Label>
                  <p className="text-sm text-muted-foreground">
                    Get a weekly summary of all job activity
                  </p>
                </div>
                <Switch
                  checked={notifications.weekly}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, weekly: checked })
                  }
                />
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button onClick={handleSave} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
