import crypto from "node:crypto";

export const sessionCookie = "session";

export function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
}

function cpfKey() {
  const value = process.env.CPF_ENCRYPTION_KEY;
  if (!value) throw new Error("CPF_ENCRYPTION_KEY is required to store CPF data.");
  const key = Buffer.from(value, "base64");
  if (key.length !== 32) throw new Error("CPF_ENCRYPTION_KEY must be a base64-encoded 32-byte key.");
  return key;
}

export function encryptCpf(cpf: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", cpfKey(), iv);
  const encrypted = Buffer.concat([cipher.update(cpf, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map((part) => part.toString("base64")).join(".");
}

export function decryptCpf(value: string | null) {
  if (!value) return null;
  const [ivValue, tagValue, encryptedValue] = value.split(".");
  if (!ivValue || !tagValue || !encryptedValue) return null;
  const decipher = crypto.createDecipheriv("aes-256-gcm", cpfKey(), Buffer.from(ivValue, "base64"));
  decipher.setAuthTag(Buffer.from(tagValue, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(encryptedValue, "base64")), decipher.final()]).toString("utf8");
}

export function normalizeCpf(value: unknown) {
  const cpf = String(value ?? "").replace(/\D/g, "");
  return cpf.length === 11 ? cpf : null;
}

export function getCookies(header = "") {
  return Object.fromEntries(header.split(";").map((part) => {
    const [key, ...value] = part.trim().split("=");
    return [key, decodeURIComponent(value.join("="))];
  }).filter(([key]) => key));
}
