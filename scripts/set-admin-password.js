const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const db = new PrismaClient();

async function main() {
  const email = "ridhwankhan03@gmail.com";
  const newPassword = "ridhwankhan123#";
  const passwordHash = await bcrypt.hash(newPassword, 10);

  await db.user.upsert({
    where: { email },
    create: {
      email,
      passwordHash,
      isEmailVerified: true,
    },
    update: {
      passwordHash,
      isEmailVerified: true,
    },
  });

  console.log("Admin password updated in DB.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
