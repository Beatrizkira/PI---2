import express from "express";
import { prisma } from "../db/prisma";
import { getAdminSession, publicCustomer } from "../middleware/auth";
import { parsePrice, productResponse, slugify, tagNames, publicAddress } from "../utils/format";

export const adminRouter = express.Router();

adminRouter.get("/customers", async (req, res) => {
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

adminRouter.get("/products", async (req, res) => {
  if (!await getAdminSession(req, res)) return;
  const products = await prisma.product.findMany({ orderBy: { name: "asc" }, include: { category: true, tags: { include: { tag: true } } } });
  res.json({ products: products.map(productResponse) });
});

adminRouter.get("/products/:id", async (req, res) => {
  if (!await getAdminSession(req, res)) return;
  const product = await prisma.product.findUnique({ where: { id: Number(req.params.id) }, include: { category: true, tags: { include: { tag: true } } } });
  if (!product) {
    res.status(404).json({ error: "Produto não encontrado." });
    return;
  }
  res.json({ product: productResponse(product) });
});

adminRouter.post("/products", async (req, res) => {
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
  const categoryRecord = await prisma.category.upsert({ where: { name: category.trim() }, update: {}, create: { name: category.trim(), slug: `${slugify(category)}-${Date.now()}` } });
  const product = await prisma.product.create({
    data: {
      sku: `PEC-${Date.now()}`, slug: `${slugify(title) || "produto"}-${Date.now()}`, name: title.trim(),
      description: String(description), regularPrice: parsedPrice, stock: parsedStock, imageUrl: image || null, categoryId: categoryRecord.id,
      tags: { create: tagNames(tags).map((name) => ({ tag: { connectOrCreate: { where: { name }, create: { name, slug: `${slugify(name)}-${Date.now()}` } } } })) },
    },
    include: { category: true, tags: { include: { tag: true } } },
  });
  res.status(201).json({ product: productResponse(product) });
});

adminRouter.patch("/products/:id", async (req, res) => {
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
  const categoryRecord = await prisma.category.upsert({ where: { name: category.trim() }, update: {}, create: { name: category.trim(), slug: `${slugify(category)}-${Date.now()}` } });
  const product = await prisma.product.update({
    where: { id: Number(req.params.id) },
    data: {
      name: title.trim(), description: String(description), regularPrice: parsedPrice, stock: parsedStock, imageUrl: image || null, categoryId: categoryRecord.id,
      tags: { deleteMany: {}, create: tagNames(tags).map((name) => ({ tag: { connectOrCreate: { where: { name }, create: { name, slug: `${slugify(name)}-${Date.now()}` } } } })) },
    },
    include: { category: true, tags: { include: { tag: true } } },
  });
  res.json({ product: productResponse(product) });
});

adminRouter.patch("/products/:id/stock", async (req, res) => {
  if (!await getAdminSession(req, res)) return;
  const stock = Number((req.body as { stock?: number }).stock);
  if (!Number.isInteger(stock) || stock < 0) {
    res.status(400).json({ error: "O estoque deve ser um número inteiro não negativo." });
    return;
  }
  const product = await prisma.product.update({ where: { id: Number(req.params.id) }, data: { stock }, select: { id: true, name: true, sku: true, stock: true } });
  res.json({ product });
});

adminRouter.delete("/products/:id", async (req, res) => {
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
