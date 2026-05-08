import { db } from "@/lib/db"
import { getSession } from "@/lib/session"
import { DashboardClient } from "@/components/dashboard/dashboard-client"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getSession()
  
  if (!session?.userId) {
    redirect("/login")
  }

  const trackedPages = await db.trackedJobPage.findMany({
    where: {
      userId: session.userId,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return <DashboardClient trackedPages={trackedPages} />
}
