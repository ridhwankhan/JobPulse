"use client"

import { motion } from "framer-motion"
import { MapPin, Clock, ExternalLink, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface JobCardProps {
  title: string
  company: string
  location: string
  postedAt: string
  type: string
  applyUrl: string
  isNew?: boolean
  delay?: number
}

export function JobCard({
  title,
  company,
  location,
  postedAt,
  type,
  applyUrl,
  isNew = false,
  delay = 0,
}: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
    >
      {isNew && (
        <div className="absolute right-4 top-4">
          <Badge className="bg-primary/20 text-primary">New</Badge>
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
          <Building2 className="h-6 w-6 text-muted-foreground" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{company}</p>
          
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {postedAt}
            </span>
            <Badge variant="secondary" className="text-xs">
              {type}
            </Badge>
          </div>
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="opacity-0 transition-opacity group-hover:opacity-100"
          asChild
        >
          <a href={applyUrl} target="_blank" rel="noopener noreferrer">
            Apply
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </div>
    </motion.div>
  )
}
