import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../src/db.js";

if (process.env.NODE_ENV === "production") {
  console.error("Refusing to create demo accounts in production.");
  process.exit(1);
}

const DEMO_PASSWORD = "Password123!";

const accounts = [
  { name: "Demo Admin", email: "admin@wolf.test", role: "ADMIN" },
  { name: "Demo Customer One", email: "customer1@wolf.test", role: "CUSTOMER" },
  { name: "Demo Customer Two", email: "customer2@wolf.test", role: "CUSTOMER" },
];

const reset = process.argv.includes("--reset");

try {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const users = {};
  for (const account of accounts) {
    users[account.email] = await prisma.user.upsert({
      where: { email: account.email },
      update: { name: account.name, role: account.role, passwordHash },
      create: { ...account, passwordHash },
    });
  }

  if (reset) {
    const admin = users["admin@wolf.test"];
    await prisma.$transaction([
      prisma.order.deleteMany(),
      prisma.commissionRequest.deleteMany(),
      prisma.artwork.updateMany({ data: { artistId: admin.id } }),
      prisma.user.deleteMany({
        where: { email: { notIn: accounts.map((a) => a.email) } },
      }),
    ]);
    console.log("Reset: removed old users, requests and orders. Artworks were kept.");
  }

  console.log(`Demo accounts ready. Password for all: ${DEMO_PASSWORD}`);
  for (const a of accounts) console.log(`  ${a.role.padEnd(8)} ${a.email}`);
} finally {
  await prisma.$disconnect();
}