import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function createOtp(params: {
  email: string;
  purpose: "signup" | "delete-account" | "forgot-password";
  userId?: string;
}) {
  const code = generateOtp();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await db.emailOtp.create({
    data: {
      email: params.email.toLowerCase(),
      purpose: params.purpose,
      codeHash,
      expiresAt,
      userId: params.userId,
    },
  });

  return { code, expiresAt };
}

export async function verifyOtp(params: {
  email: string;
  purpose: "signup" | "delete-account" | "forgot-password";
  code: string;
}) {
  const otp = await db.emailOtp.findFirst({
    where: {
      email: params.email.toLowerCase(),
      purpose: params.purpose,
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) {
    return { ok: false as const, error: "OTP expired or not found" };
  }
  if (otp.attempts >= MAX_ATTEMPTS) {
    return { ok: false as const, error: "Too many failed attempts. Request a new OTP." };
  }

  const isMatch = await bcrypt.compare(params.code, otp.codeHash);
  if (!isMatch) {
    await db.emailOtp.update({
      where: { id: otp.id },
      data: { attempts: { increment: 1 } },
    });
    return { ok: false as const, error: "Invalid OTP" };
  }

  await db.emailOtp.update({
    where: { id: otp.id },
    data: { consumedAt: new Date() },
  });

  return { ok: true as const, otp };
}
