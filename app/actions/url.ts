"use server"

import { db } from "@/lib/db"
import { getSession } from "@/lib/session"
import { revalidatePath } from "next/cache"

export async function addTrackedUrl(url: string, companyName: string) {
  const session = await getSession()
  if (!session?.userId) {
    return { error: "Unauthorized" }
  }

  if (!url || !companyName) {
    return { error: "Missing required fields" }
  }

  try {
    const page = await db.trackedJobPage.create({
      data: {
        url,
        companyName,
        userId: session.userId as string,
      },
    })

    revalidatePath("/dashboard/urls")
    return { success: true, page }
  } catch (err) {
    console.error("[addTrackedUrl] DB error:", err)
    return { error: "Failed to save URL. Please try again." }
  }
}

export async function deleteTrackedUrl(id: string) {
  const session = await getSession()
  if (!session?.userId) {
    return { error: "Unauthorized" }
  }

  try {
    // Ensure the URL belongs to this user before deleting
    await db.trackedJobPage.deleteMany({
      where: { id, userId: session.userId as string },
    })

    revalidatePath("/dashboard/urls")
    return { success: true }
  } catch (err) {
    return { error: "Failed to delete URL." }
  }
}
