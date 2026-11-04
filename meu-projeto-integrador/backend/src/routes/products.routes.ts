import express from "express";
import { prisma } from "../db/prisma";
import { productResponse } from "../utils/format";

export const productsRouter = express.Router();

productsRouter.get("/", async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      include: { category: true, tags: { include: { tag: true } } },
    });

    res.json({ products: products.map(productResponse) });
  } catch (error) {
    console.error("Public product listing failed:", error);
    res.status(500).json({ error: "Não foi possível carregar os produtos." });
  }
});

productsRouter.get("/:slug", async (req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: { slug: req.params.slug, active: true },
      include: { category: true, tags: { include: { tag: true } } },
    });
    if (!product) {
      res.status(404).json({ error: "Produto não encontrado." });
      return;
    }
    res.json({ product: productResponse(product) });
  } catch (error) {
    console.error("Public product lookup failed:", error);
    res.status(500).json({ error: "Não foi possível carregar o produto." });
  }
});
