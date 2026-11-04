import express from "express";
import { prisma } from "../db/prisma";
import { createSession, getSession, publicCustomer } from "../middleware/auth";
import { encryptCpf, getCookies, hashPassword, normalizeCpf, sessionCookie, verifyPassword } from "../utils/security";
import { normalizeZipCode, publicAddress } from "../utils/format";

export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  const customer = email ? await prisma.customer.findUnique({ where: { email: email.trim().toLowerCase() } }) : null;
  if (!customer || !password || !customer.passwordHash || !verifyPassword(password, customer.passwordHash)) {
    res.status(401).json({ error: "E-mail ou senha inválidos." });
    return;
  }
  await createSession(res, customer.id);
  res.json({ user: publicCustomer(customer) });
});

authRouter.post("/logout", async (req, res) => {
  const token = getCookies(req.headers.cookie)[sessionCookie];
  if (token) await prisma.session.deleteMany({ where: { id: token } });
  res.setHeader("Set-Cookie", `${sessionCookie}=; HttpOnly; Path=/; Max-Age=0`);
  res.sendStatus(204);
});

authRouter.get("/me", async (req, res) => {
  const session = await getSession(req);
  if (!session) {
    res.status(401).json({ error: "Não autenticado." });
    return;
  }
  res.json({ user: publicCustomer(session.customer) });
});

authRouter.patch("/me", async (req, res) => {
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

authRouter.patch("/password", async (req, res) => {
  const session = await getSession(req);
  if (!session) {
    res.status(401).json({ error: "Não autenticado." });
    return;
  }
  const { currentPassword, newPassword, confirmPassword } = req.body as { currentPassword?: string; newPassword?: string; confirmPassword?: string };
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

authRouter.get("/addresses", async (req, res) => {
  const session = await getSession(req);
  if (!session) {
    res.status(401).json({ error: "Não autenticado." });
    return;
  }
  const addresses = await prisma.address.findMany({ where: { customerId: session.customerId }, orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] });
  res.json({ addresses: addresses.map(publicAddress) });
});

authRouter.post("/addresses", async (req, res) => {
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

authRouter.patch("/addresses/:id", async (req, res) => {
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

authRouter.delete("/addresses/:id", async (req, res) => {
  const session = await getSession(req);
  if (!session) {
    res.status(401).json({ error: "Não autenticado." });
    return;
  }
  await prisma.address.deleteMany({ where: { id: Number(req.params.id), customerId: session.customerId } });
  res.sendStatus(204);
});
