export function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function parsePrice(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const normalized = String(value).replace(/\./g, "").replace(",", ".");
  const price = Number(normalized);
  return Number.isFinite(price) && price >= 0 ? price : null;
}

export function tagNames(value: unknown) {
  return String(value ?? "").split(",").map((tag) => tag.trim()).filter(Boolean).filter((tag, index, list) => list.indexOf(tag) === index);
}

export function normalizeZipCode(value: unknown) {
  const zipCode = String(value ?? "").replace(/\D/g, "");
  return /^\d{8}$/.test(zipCode) ? zipCode : null;
}

export function publicAddress(address: {
  id: number; label: string; zipCode: string; street: string; number: string;
  complement: string | null; city: string; state: string; isDefault: boolean;
}) {
  return { ...address, zipCode: `${address.zipCode.slice(0, 5)}-${address.zipCode.slice(5)}` };
}

export function productResponse(product: {
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
