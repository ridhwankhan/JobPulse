import { db } from "@/lib/db";

export async function getUserAccessById(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      isBanned: true,
      isRestricted: true,
      banReason: true,
    },
  });
}

export async function assertUserCanUseApp(userId: string) {
  const user = await getUserAccessById(userId);
  if (!user) {
    return { ok: false as const, status: 404, error: "User not found" };
  }
  if (user.isBanned) {
    return {
      ok: false as const,
      status: 403,
      error: user.banReason || "Your account is banned. Contact admin.",
    };
  }
  return { ok: true as const, user };
}

export async function assertUserCanUseWriteActions(userId: string) {
  const canUse = await assertUserCanUseApp(userId);
  if (!canUse.ok) return canUse;
  if (canUse.user.isRestricted) {
    return {
      ok: false as const,
      status: 403,
      error: "Your account is restricted by admin.",
    };
  }
  return canUse;
}
