const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: "CUSTOMER" | "ADMIN";
};

export type Product = {
  id: number;
  sku: string;
  slug: string;
  title: string;
  category: string;
  price: string;
  description: string;
  tags: string;
  image: string | null;
  stock: number;
};

async function request<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Não foi possível concluir a operação.");
  return data as T;
}

export const api = {
  login: (email: string, password: string) => request<{ user: User }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) => request<{ user: User }>("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  me: () => request<{ user: User }>("/api/auth/me"),
  updateProfile: (data: Pick<User, "name" | "email" | "phone" | "address">) => request<{ user: User }>("/api/auth/me", { method: "PATCH", body: JSON.stringify(data) }),
  logout: () => request<void>("/api/auth/logout", { method: "POST" }),
  products: () => request<{ products: Product[] }>("/api/admin/products"),
  product: (id: number) => request<{ product: Product }>(`/api/admin/products/${id}`),
  createProduct: (data: Omit<Product, "id" | "sku" | "slug">) => request<{ product: Product }>("/api/admin/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id: number, data: Omit<Product, "id" | "sku" | "slug">) => request<{ product: Product }>(`/api/admin/products/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  updateStock: (id: number, stock: number) => request<{ product: { id: number; name: string; sku: string; stock: number } }>(`/api/admin/products/${id}/stock`, { method: "PATCH", body: JSON.stringify({ stock }) }),
  deleteProduct: (id: number) => request<void>(`/api/admin/products/${id}`, { method: "DELETE" }),
};
