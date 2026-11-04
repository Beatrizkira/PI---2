const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  cpf: string | null;
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
  brand: string;
  weight: string;
  type: string;
  dimensions: string;
  tags: string;
  image: string | null;
  stock: number;
};

export type Address = {
  id: number;
  label: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string | null;
  city: string;
  state: string;
  isDefault: boolean;
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
  updateProfile: (data: Pick<User, "name" | "email" | "phone"> & { address?: string; cpf?: string }) => request<{ user: User }>("/api/auth/me", { method: "PATCH", body: JSON.stringify(data) }),
  logout: () => request<void>("/api/auth/logout", { method: "POST" }),
  products: () => request<{ products: Product[] }>("/api/admin/products"),
  publicProducts: () => request<{ products: Product[] }>("/api/products"),
  publicProduct: (slug: string) => request<{ product: Product }>(`/api/products/${encodeURIComponent(slug)}`),
  product: (id: number) => request<{ product: Product }>(`/api/admin/products/${id}`),
  createProduct: (data: Omit<Product, "id" | "sku" | "slug">) => request<{ product: Product }>("/api/admin/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id: number, data: Omit<Product, "id" | "sku" | "slug">) => request<{ product: Product }>(`/api/admin/products/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  updateStock: (id: number, stock: number) => request<{ product: { id: number; name: string; sku: string; stock: number } }>(`/api/admin/products/${id}/stock`, { method: "PATCH", body: JSON.stringify({ stock }) }),
  deleteProduct: (id: number) => request<void>(`/api/admin/products/${id}`, { method: "DELETE" }),
  changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => request<void>("/api/auth/password", { method: "PATCH", body: JSON.stringify(data) }),
  addresses: () => request<{ addresses: Address[] }>("/api/auth/addresses"),
  createAddress: (data: Omit<Address, "id">) => request<{ address: Address }>("/api/auth/addresses", { method: "POST", body: JSON.stringify(data) }),
  updateAddress: (id: number, data: Omit<Address, "id">) => request<{ address: Address }>(`/api/auth/addresses/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteAddress: (id: number) => request<void>(`/api/auth/addresses/${id}`, { method: "DELETE" }),
  customers: (page: number, pageSize = 20) => request<{ customers: Customer[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } }>(`/api/admin/customers?page=${page}&pageSize=${pageSize}`),
};

export type Customer = User & { addresses: Address[] };
