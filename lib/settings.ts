import { db } from "@/lib/db";

const SIGNUP_ENABLED_KEY = "signup_enabled";

export async function isSignupEnabled() {
  const setting = await db.appSetting.findUnique({
    where: { key: SIGNUP_ENABLED_KEY },
  });
  if (!setting) return true;
  return setting.value === "true";
}

export async function setSignupEnabled(enabled: boolean) {
  await db.appSetting.upsert({
    where: { key: SIGNUP_ENABLED_KEY },
    create: { key: SIGNUP_ENABLED_KEY, value: enabled ? "true" : "false" },
    update: { value: enabled ? "true" : "false" },
  });
}

export async function getAdminSettings() {
  return {
    signupEnabled: await isSignupEnabled(),
  };
}
