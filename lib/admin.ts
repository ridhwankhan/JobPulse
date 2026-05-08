import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export function getAdminEmail() {
  return (process.env.ADMIN_EMAIL || "ridhwankhan03@gmail.com").toLowerCase();
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.userId) return null;
  return db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true },
  });
}

export async function requireAdminUser() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.email.toLowerCase() !== getAdminEmail()) return null;
  return user;
}
