import dotenv from "dotenv";
import express from "express";
import crypto from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const environment = process.env.NODE_ENV || "development";
dotenv.config();
dotenv.config({ path: `.env.${environment}`, override: true });

const app = express();
const port = Number(process.env.PORT) || 4000;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to start the backend.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg(databaseUrl) });
const sessionCookie = "session";

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
}

function getCookies(header = "") {
  return Object.fromEntries(header.split(";").map((part) => {
    const [key, ...value] = part.trim().split("=");
    return [key, decodeURIComponent(value.join("="))];
  }).filter(([key]) => key));
}

async function getSession(req: express.Request) {
  const token = getCookies(req.headers.cookie)[sessionCookie];
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { id: token },
    include: { customer: true },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session;
}

async function getAdminSession(req: express.Request, res: express.Response) {
  const session = await getSession(req);
  if (!session) {
    res.status(401).json({ error: "Não autenticado." });
    return null;
  }
  if (session.customer.role !== "ADMIN") {
    res.status(403).json({ error: "Acesso restrito ao administrador." });
    return null;
  }
  return session;
}

function publicCustomer(customer: { id: number; name: string; email: string; phone: string | null; address?: string | null; role: string }) {
  return { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone, address: customer.address ?? null, role: customer.role };
}

async function createSession(res: express.Response, customerId: number) {
  const id = crypto.randomBytes(32).toString("hex");
  await prisma.session.create({
    data: { id, customerId, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) },
  });
  res.setHeader("Set-Cookie", `${sessionCookie}=${id}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`);
}

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body as { name?: string; email?: string; password?: string };
  if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
    res.status(400).json({ error: "Nome, e-mail e senha com pelo menos 8 caracteres são obrigatórios." });
    return;
  }
  try {
    const customer = await prisma.customer.create({
      data: { name: name.trim(), email: email.trim().toLowerCase(), passwordHash: hashPassword(password) },
    });
    await createSession(res, customer.id);
    res.status(201).json({ user: publicCustomer(customer) });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      res.status(409).json({ error: "Este e-mail já está cadastrado." });
      return;
    }
    console.error("Registration failed:", error);
    res.status(500).json({ error: "Não foi possível criar a conta." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  const customer = email ? await prisma.customer.findUnique({ where: { email: email.trim().toLowerCase() } }) : null;
  if (!customer || !password || !customer.passwordHash || !verifyPassword(password, customer.passwordHash)) {
    res.status(401).json({ error: "E-mail ou senha inválidos." });
    return;
  }
  await createSession(res, customer.id);
  res.json({ user: publicCustomer(customer) });
});

app.post("/api/auth/logout", async (req, res) => {
  const token = getCookies(req.headers.cookie)[sessionCookie];
  if (token) await prisma.session.deleteMany({ where: { id: token } });
  res.setHeader("Set-Cookie", `${sessionCookie}=; HttpOnly; Path=/; Max-Age=0`);
  res.sendStatus(204);
});

app.get("/api/auth/me", async (req, res) => {
  const session = await getSession(req);
  if (!session) {
    res.status(401).json({ error: "Não autenticado." });
    return;
  }
  res.json({ user: publicCustomer(session.customer) });
});

app.patch("/api/auth/me", async (req, res) => {
  const session = await getSession(req);
  if (!session) {
    res.status(401).json({ error: "Não autenticado." });
    return;
  }
  const { name, email, phone, address } = req.body as { name?: string; email?: string; phone?: string; address?: string };
  if (!name?.trim() || !email?.trim()) {
    res.status(400).json({ error: "Nome e e-mail são obrigatórios." });
    return;
  }
  try {
    const customer = await prisma.customer.update({
      where: { id: session.customerId },
      data: { name: name.trim(), email: email.trim().toLowerCase(), phone: phone?.trim() || null, address: address?.trim() || null },
    });

    res.json({ user: publicCustomer(customer) });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      res.status(409).json({ error: "Este e-mail já está cadastrado." });
      return;
    }
    console.error("Profile update failed:", error);
    res.status(500).json({ error: "Não foi possível atualizar o perfil." });
  }
});

app.get("/api/admin/products", async (req, res) => {
  if (!await getAdminSession(req, res)) return;
  const products = await prisma.product.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, sku: true, stock: true } });
  res.json({ products });
});

app.patch("/api/admin/products/:id/stock", async (req, res) => {
  if (!await getAdminSession(req, res)) return;
  const stock = Number((req.body as { stock?: number }).stock);
  if (!Number.isInteger(stock) || stock < 0) {
    res.status(400).json({ error: "O estoque deve ser um número inteiro não negativo." });
    return;
  }
  const product = await prisma.product.update({
    where: { id: Number(req.params.id) },
    data: { stock },
    select: { id: true, name: true, sku: true, stock: true },
  });
  res.json({ product });
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
