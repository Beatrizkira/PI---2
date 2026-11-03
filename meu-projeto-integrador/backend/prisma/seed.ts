import "dotenv/config";
import crypto from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import catalog from "../../frontend/src/data/Product.json";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run the database seed.");
}

const adapter = new PrismaPg(databaseUrl);
const prisma = new PrismaClient({ adapter });

function parsePrice(value: string) {
  return Number(value.replace(/\./g, "").replace(",", "."));
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = `${salt}:${crypto.scryptSync(adminPassword, salt, 64).toString("hex")}`;
    await prisma.customer.upsert({
      where: { email: adminEmail.toLowerCase() },
      update: { role: "ADMIN", passwordHash },
      create: { name: "Administrador", email: adminEmail.toLowerCase(), passwordHash, role: "ADMIN" },
    });
  }
  for (const item of catalog) {
    const category = await prisma.category.upsert({
      where: { name: item.category },
      update: {},
      create: { name: item.category, slug: slugify(item.category) },
    });

    await prisma.product.upsert({
      where: { sku: `PEC-${String(item.id).padStart(4, "0")}` },
      update: {
        name: item.title,
        description: item.descripTion,
        regularPrice: parsePrice(item.price),
        imageUrl: `/assets/images/grocery/${item.image}`,
        categoryId: category.id,
      },
      create: {
        sku: `PEC-${String(item.id).padStart(4, "0")}`,
        slug: item.slug,
        name: item.title,
        description: item.descripTion,
        regularPrice: parsePrice(item.price),
        stock: 0,
        imageUrl: `/assets/images/grocery/${item.image}`,
        categoryId: category.id,
      },
    });
  }

  await prisma.coupon.upsert({
    where: { code: "12345" },
    update: { discountPercent: 25, active: true },
    create: { code: "12345", discountPercent: 25 },
  });
}

main()
  .catch((error) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
