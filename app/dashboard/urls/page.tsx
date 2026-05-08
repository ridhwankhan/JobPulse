import { Header } from "@/components/dashboard/header"
import { UrlTracker } from "@/components/dashboard/url-tracker"
import { db } from "@/lib/db"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function UrlsPage() {
  const session = await getSession()
  if (!session?.userId) {
    redirect("/login")
  }

  const trackedPages = await db.trackedJobPage.findMany({
    where: { userId: session.userId as string },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen">
      <Header
        title="Track URLs"
        description="Add and manage career page URLs to monitor for new job postings"
      />

      <div className="p-6">
        <div className="max-w-4xl">
          <UrlTracker initialTrackedPages={trackedPages} />
        </div>
      </div>
    </div>
  )
}
