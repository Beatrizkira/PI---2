import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { databaseUrl } from "../config/env";

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to start the backend.");
}

export const prisma = new PrismaClient({ adapter: new PrismaPg(databaseUrl) });
