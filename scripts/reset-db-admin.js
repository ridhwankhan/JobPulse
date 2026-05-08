const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const db = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_RESET_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_RESET_PASSWORD env vars before running this script.");
  }

  await db.jobListing.deleteMany();
  await db.trackedJobPage.deleteMany();
  await db.userPreferences.deleteMany();
  await db.emailOtp.deleteMany();
  await db.appSetting.deleteMany();
  await db.user.deleteMany();

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await db.user.create({
    data: {
      email: adminEmail.toLowerCase(),
      passwordHash,
      isEmailVerified: true,
    },
  });

  await db.appSetting.create({
    data: {
      key: "signup_enabled",
      value: "true",
    },
  });

  console.log("Database cleaned. Admin account recreated.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
