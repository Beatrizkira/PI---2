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

app.use(express.json({ limit: "8mb" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
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

function cpfKey() {
  const value = process.env.CPF_ENCRYPTION_KEY;
  if (!value) throw new Error("CPF_ENCRYPTION_KEY is required to store CPF data.");
  const key = Buffer.from(value, "base64");
  if (key.length !== 32) throw new Error("CPF_ENCRYPTION_KEY must be a base64-encoded 32-byte key.");
  return key;
}

function encryptCpf(cpf: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", cpfKey(), iv);
  const encrypted = Buffer.concat([cipher.update(cpf, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map((part) => part.toString("base64")).join(".");
}

function decryptCpf(value: string | null) {
  if (!value) return null;
  const [ivValue, tagValue, encryptedValue] = value.split(".");
  if (!ivValue || !tagValue || !encryptedValue) return null;
  const decipher = crypto.createDecipheriv("aes-256-gcm", cpfKey(), Buffer.from(ivValue, "base64"));
  decipher.setAuthTag(Buffer.from(tagValue, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(encryptedValue, "base64")), decipher.final()]).toString("utf8");
}

function normalizeCpf(value: unknown) {
  const cpf = String(value ?? "").replace(/\D/g, "");
  return cpf.length === 11 ? cpf : null;
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function parsePrice(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const normalized = String(value).replace(/\./g, "").replace(",", ".");
  const price = Number(normalized);
  return Number.isFinite(price) && price >= 0 ? price : null;
}

function productResponse(product: {
  id: number; sku: string; slug: string; name: string; description: string;
  regularPrice: unknown; salePrice: unknown; stock: number; imageUrl: string | null;
  category: { name: string }; tags: { tag: { name: string } }[];
}) {
  return {
    id: product.id,
    sku: product.sku,
    slug: product.slug,
    title: product.name,
    category: product.category.name,
    price: String(product.regularPrice),
    description: product.description,
    tags: product.tags.map(({ tag }) => tag.name).join(", "),
    image: product.imageUrl,
    stock: product.stock,
  };
}

function tagNames(value: unknown) {
  return String(value ?? "").split(",").map((tag) => tag.trim()).filter(Boolean).filter((tag, index, list) => list.indexOf(tag) === index);
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

function publicCustomer(customer: { id: number; name: string; email: string; phone: string | null; address?: string | null; cpfEncrypted?: string | null; role: string }) {
  return { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone, address: customer.address ?? null, cpf: decryptCpf(customer.cpfEncrypted ?? null), role: customer.role };
}

function normalizeZipCode(value: unknown) {
  const zipCode = String(value ?? "").replace(/\D/g, "");
  return /^\d{8}$/.test(zipCode) ? zipCode : null;
}

function publicAddress(address: {
  id: number; label: string; zipCode: string; street: string; number: string;
  complement: string | null; city: string; state: string; isDefault: boolean;
}) {
  return { ...address, zipCode: `${address.zipCode.slice(0, 5)}-${address.zipCode.slice(5)}` };
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
  const { name, email, phone, address, cpf } = req.body as { name?: string; email?: string; phone?: string; address?: string; cpf?: string };
  if (!name?.trim() || !email?.trim()) {
    res.status(400).json({ error: "Nome e e-mail são obrigatórios." });
    return;
  }
  if (cpf?.trim() && !normalizeCpf(cpf)) {
    res.status(400).json({ error: "O CPF deve conter 11 números." });
    return;
  }
  try {
    const customer = await prisma.customer.update({
      where: { id: session.customerId },
      data: { name: name.trim(), email: email.trim().toLowerCase(), phone: phone?.trim() || null, address: address?.trim() || null, ...(cpf === undefined ? {} : { cpfEncrypted: normalizeCpf(cpf) ? encryptCpf(normalizeCpf(cpf) as string) : null }) },
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

app.patch("/api/auth/password", async (req, res) => {
  const session = await getSession(req);
  if (!session) {
    res.status(401).json({ error: "Não autenticado." });
    return;
  }
  const { currentPassword, newPassword, confirmPassword } = req.body as {
    currentPassword?: string; newPassword?: string; confirmPassword?: string;
  };
  if (!currentPassword || !newPassword || newPassword.length < 8 || newPassword !== confirmPassword) {
    res.status(400).json({ error: "Informe a senha atual, uma nova senha com pelo menos 8 caracteres e a confirmação igual." });
    return;
  }
  if (!verifyPassword(currentPassword, session.customer.passwordHash)) {
    res.status(401).json({ error: "A senha atual está incorreta." });
    return;
  }
  await prisma.customer.update({ where: { id: session.customerId }, data: { passwordHash: hashPassword(newPassword) } });
  res.sendStatus(204);
});

app.get("/api/auth/addresses", async (req, res) => {
  const session = await getSession(req);
  if (!session) {
    res.status(401).json({ error: "Não autenticado." });
    return;
  }
  const addresses = await prisma.address.findMany({ where: { customerId: session.customerId }, orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] });
  res.json({ addresses: addresses.map(publicAddress) });
});

app.post("/api/auth/addresses", async (req, res) => {
  const session = await getSession(req);
  if (!session) {
    res.status(401).json({ error: "Não autenticado." });
    return;
  }
  const { label, zipCode, street, number, complement, city, state, isDefault = false } = req.body as Record<string, unknown>;
  const normalizedZip = normalizeZipCode(zipCode);
  if (typeof label !== "string" || !label.trim() || !normalizedZip || typeof street !== "string" || !street.trim() || typeof number !== "string" || !number.trim() || typeof city !== "string" || !city.trim() || typeof state !== "string" || !/^[A-Za-zÀ-ÿ]{2}$/.test(state.trim())) {
    res.status(400).json({ error: "Preencha tipo, CEP, endereço, número, cidade e estado corretamente." });
    return;
  }
  const address = await prisma.$transaction(async (transaction) => {
    if (isDefault) await transaction.address.updateMany({ where: { customerId: session.customerId }, data: { isDefault: false } });
    return transaction.address.create({ data: { customerId: session.customerId, label: label.trim(), zipCode: normalizedZip, street: street.trim(), number: number.trim(), complement: typeof complement === "string" && complement.trim() ? complement.trim() : null, city: city.trim(), state: state.trim().toUpperCase(), isDefault: Boolean(isDefault) } });
  });
  res.status(201).json({ address: publicAddress(address) });
});

app.patch("/api/auth/addresses/:id", async (req, res) => {
  const session = await getSession(req);
  if (!session) {
    res.status(401).json({ error: "Não autenticado." });
    return;
  }
  const id = Number(req.params.id);
  const { label, zipCode, street, number, complement, city, state, isDefault = false } = req.body as Record<string, unknown>;
  const normalizedZip = normalizeZipCode(zipCode);
  if (!normalizedZip || typeof label !== "string" || !label.trim() || typeof street !== "string" || !street.trim() || typeof number !== "string" || !number.trim() || typeof city !== "string" || !city.trim() || typeof state !== "string" || !/^[A-Za-zÀ-ÿ]{2}$/.test(state.trim())) {
    res.status(400).json({ error: "Preencha tipo, CEP, endereço, número, cidade e estado corretamente." });
    return;
  }
  const existing = await prisma.address.findFirst({ where: { id, customerId: session.customerId } });
  if (!existing) {
    res.status(404).json({ error: "Endereço não encontrado." });
    return;
  }
  const address = await prisma.$transaction(async (transaction) => {
    if (isDefault) await transaction.address.updateMany({ where: { customerId: session.customerId, id: { not: id } }, data: { isDefault: false } });
    return transaction.address.update({ where: { id }, data: { label: label.trim(), zipCode: normalizedZip, street: street.trim(), number: number.trim(), complement: typeof complement === "string" && complement.trim() ? complement.trim() : null, city: city.trim(), state: state.trim().toUpperCase(), isDefault: Boolean(isDefault) } });
  });
  res.json({ address: publicAddress(address) });
});

app.delete("/api/auth/addresses/:id", async (req, res) => {
  const session = await getSession(req);
  if (!session) {
    res.status(401).json({ error: "Não autenticado." });
    return;
  }
  await prisma.address.deleteMany({ where: { id: Number(req.params.id), customerId: session.customerId } });
  res.sendStatus(204);
});

app.get("/api/admin/customers", async (req, res) => {
  if (!await getAdminSession(req, res)) return;
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 20));
  const [total, customers] = await prisma.$transaction([
    prisma.customer.count({ where: { role: "CUSTOMER" } }),
    prisma.customer.findMany({
      where: { role: "CUSTOMER" },
      orderBy: { name: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { addresses: { orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] } },
    }),
  ]);
  res.json({
    customers: customers.map((customer) => ({
      ...publicCustomer(customer),
      addresses: customer.addresses.map(publicAddress),
    })),
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
});

app.get("/api/admin/products", async (req, res) => {
  if (!await getAdminSession(req, res)) return;
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: { category: true, tags: { include: { tag: true } } },
  });
  res.json({ products: products.map(productResponse) });
});

app.get("/api/admin/products/:id", async (req, res) => {
  if (!await getAdminSession(req, res)) return;
  const product = await prisma.product.findUnique({
    where: { id: Number(req.params.id) },
    include: { category: true, tags: { include: { tag: true } } },
  });
  if (!product) {
    res.status(404).json({ error: "Produto não encontrado." });
    return;
  }
  res.json({ product: productResponse(product) });
});

app.post("/api/admin/products", async (req, res) => {
  if (!await getAdminSession(req, res)) return;
  const { title, category, price, description = "", tags = "", image = "", stock = 0 } = req.body as Record<string, unknown>;
  const parsedPrice = parsePrice(price);
  const parsedStock = Number(stock);
  if (typeof title !== "string" || !title.trim() || typeof category !== "string" || !category.trim() || parsedPrice === null || !Number.isInteger(parsedStock) || parsedStock < 0) {
    res.status(400).json({ error: "Nome, categoria, preço e estoque válido são obrigatórios." });
    return;
  }
  if (typeof image !== "string" || image.length > 7_500_000) {
    res.status(400).json({ error: "A imagem deve ter no máximo 5 MB." });
    return;
  }
  const categoryRecord = await prisma.category.upsert({
    where: { name: category.trim() },
    update: {},
    create: { name: category.trim(), slug: `${slugify(category)}-${Date.now()}` },
  });
  const baseSlug = slugify(title);
  const slug = `${baseSlug || "produto"}-${Date.now()}`;
  const product = await prisma.product.create({
    data: {
      sku: `PEC-${Date.now()}`,
      slug,
      name: title.trim(),
      description: String(description),
      regularPrice: parsedPrice,
      stock: parsedStock,
      imageUrl: image || null,
      categoryId: categoryRecord.id,
      tags: { create: tagNames(tags).map((name) => ({ tag: { connectOrCreate: { where: { name }, create: { name, slug: `${slugify(name)}-${Date.now()}` } } } })) },
    },
    include: { category: true, tags: { include: { tag: true } } },
  });
  res.status(201).json({ product: productResponse(product) });
});

app.patch("/api/admin/products/:id", async (req, res) => {
  if (!await getAdminSession(req, res)) return;
  const { title, category, price, description = "", tags = "", image = "", stock = 0 } = req.body as Record<string, unknown>;
  const parsedPrice = parsePrice(price);
  const parsedStock = Number(stock);
  if (typeof title !== "string" || !title.trim() || typeof category !== "string" || !category.trim() || parsedPrice === null || !Number.isInteger(parsedStock) || parsedStock < 0) {
    res.status(400).json({ error: "Nome, categoria, preço e estoque válido são obrigatórios." });
    return;
  }
  if (typeof image !== "string" || image.length > 7_500_000) {
    res.status(400).json({ error: "A imagem deve ter no máximo 5 MB." });
    return;
  }
  const categoryRecord = await prisma.category.upsert({
    where: { name: category.trim() },
    update: {},
    create: { name: category.trim(), slug: `${slugify(category)}-${Date.now()}` },
  });
  const product = await prisma.product.update({
    where: { id: Number(req.params.id) },
    data: {
      name: title.trim(),
      description: String(description),
      regularPrice: parsedPrice,
      stock: parsedStock,
      imageUrl: image || null,
      categoryId: categoryRecord.id,
      tags: {
        deleteMany: {},
        create: tagNames(tags).map((name) => ({ tag: { connectOrCreate: { where: { name }, create: { name, slug: `${slugify(name)}-${Date.now()}` } } } })),
      },
    },
    include: { category: true, tags: { include: { tag: true } } },
  });
  res.json({ product: productResponse(product) });
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

app.delete("/api/admin/products/:id", async (req, res) => {
  if (!await getAdminSession(req, res)) return;
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Produto inválido." });
    return;
  }
  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.productTag.deleteMany({ where: { productId: id } });
      await transaction.productImage.deleteMany({ where: { productId: id } });
      await transaction.inventoryMovement.deleteMany({ where: { productId: id } });
      await transaction.cartItem.deleteMany({ where: { productId: id } });
      await transaction.wishlistItem.deleteMany({ where: { productId: id } });
      await transaction.compareItem.deleteMany({ where: { productId: id } });
      await transaction.product.delete({ where: { id } });
    });
    res.sendStatus(204);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      res.status(404).json({ error: "Produto não encontrado." });
      return;
    }
    console.error("Product deletion failed:", error);
    res.status(500).json({ error: "Não foi possível remover o produto." });
  }
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
