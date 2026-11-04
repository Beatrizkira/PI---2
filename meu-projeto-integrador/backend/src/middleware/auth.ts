import crypto from "node:crypto";
import express from "express";
import { prisma } from "../db/prisma";
import { getCookies, sessionCookie } from "../utils/security";
import { decryptCpf } from "../utils/security";

export function publicCustomer(customer: {
  id: number; name: string; email: string; phone: string | null;
  address?: string | null; cpfEncrypted?: string | null; role: string;
}) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address ?? null,
    cpf: decryptCpf(customer.cpfEncrypted ?? null),
    role: customer.role,
  };
}

export async function getSession(req: express.Request) {
  const token = getCookies(req.headers.cookie)[sessionCookie];
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { id: token },
    include: { customer: true },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session;
}

export async function getAdminSession(req: express.Request, res: express.Response) {
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

export async function createSession(res: express.Response, customerId: number) {
  const id = crypto.randomBytes(32).toString("hex");
  await prisma.session.create({
    data: { id, customerId, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) },
  });
  res.setHeader("Set-Cookie", `${sessionCookie}=${id}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`);
}
