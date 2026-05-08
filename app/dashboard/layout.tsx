import { Sidebar } from "@/components/dashboard/sidebar"
import { getSession } from "@/lib/session"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session?.userId) {
    redirect("/login")
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { isBanned: true, banReason: true },
  })
  if (user?.isBanned) {
    const reason = encodeURIComponent(user.banReason || "Your account is banned. Contact admin.")
    redirect(`/login?error=${reason}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        {children}
      </main>
    </div>
  )
}
