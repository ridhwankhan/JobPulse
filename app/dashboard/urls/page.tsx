"use client"

import { Header } from "@/components/dashboard/header"
import { UrlTracker } from "@/components/dashboard/url-tracker"

export default function UrlsPage() {
  return (
    <div className="min-h-screen">
      <Header
        title="Track URLs"
        description="Add and manage career page URLs to monitor for new job postings"
      />

      <div className="p-6">
        <div className="max-w-4xl">
          <UrlTracker />
        </div>
      </div>
    </div>
  )
}
