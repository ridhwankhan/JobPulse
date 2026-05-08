"use server"

import { db } from "@/lib/db"
import { getSession } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { assertUserCanUseWriteActions } from "@/lib/user-access"

export async function addTrackedUrl(url: string, companyName: string) {
  const session = await getSession()
  if (!session?.userId) return { error: "Unauthorized" }
  const access = await assertUserCanUseWriteActions(session.userId)
  if (!access.ok) return { error: access.error }
  if (!url || !companyName) return { error: "Missing required fields" }

  try {
    const page = await db.trackedJobPage.create({
      data: { url, companyName, userId: session.userId as string },
    })
    revalidatePath("/dashboard/urls")
    revalidatePath("/dashboard")
    return { success: true, page }
  } catch (err) {
    console.error("[addTrackedUrl] DB error:", err)
    return { error: "Failed to save URL. Please try again." }
  }
}

export async function updateTrackedUrl(id: string, url: string, companyName: string) {
  const session = await getSession()
  if (!session?.userId) return { error: "Unauthorized" }
  const access = await assertUserCanUseWriteActions(session.userId)
  if (!access.ok) return { error: access.error }
  if (!url || !companyName) return { error: "Missing required fields" }

  try {
    // Ensure the page belongs to this user
    const existing = await db.trackedJobPage.findFirst({
      where: { id, userId: session.userId as string },
    })
    if (!existing) return { error: "URL not found" }

    const page = await db.trackedJobPage.update({
      where: { id },
      data: { url, companyName, lastScraped: null },
    })
    revalidatePath("/dashboard/urls")
    revalidatePath("/dashboard")
    return { success: true, page }
  } catch (err) {
    console.error("[updateTrackedUrl] DB error:", err)
    return { error: "Failed to update URL." }
  }
}

export async function deleteTrackedUrl(id: string) {
  const session = await getSession()
  if (!session?.userId) return { error: "Unauthorized" }
  const access = await assertUserCanUseWriteActions(session.userId)
  if (!access.ok) return { error: access.error }

  try {
    await db.trackedJobPage.deleteMany({
      where: { id, userId: session.userId as string },
    })
    revalidatePath("/dashboard/urls")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (err) {
    return { error: "Failed to delete URL." }
  }
}
