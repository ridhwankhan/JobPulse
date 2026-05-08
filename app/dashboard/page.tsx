import { db } from "@/lib/db"
import { getSession } from "@/lib/session"
import { DashboardClient } from "@/components/dashboard/dashboard-client"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session?.userId) redirect("/login")

  const [trackedPages, recentJobs, totalJobs] = await Promise.all([
    db.trackedJobPage.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    }),
    db.jobListing.findMany({
      where: {
        trackedPage: { userId: session.userId },
      },
      include: { trackedPage: { select: { companyName: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    db.jobListing.count({
      where: { trackedPage: { userId: session.userId } },
    }),
  ])

  return (
    <DashboardClient
      trackedPages={trackedPages}
      recentJobs={recentJobs}
      totalJobs={totalJobs}
    />
  )
}
