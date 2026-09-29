export const adminTokenStorageKey = "medde-padilla-admin-token";

const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

export type ApiProperty = {
  _id: string;
  slug: string;
  title: string;
  operation: string;
  propertyType: string;
  price: number;
  currency: string;
  status: "draft" | "published";
  street: string;
  city: string;
  totalArea?: number;
  coveredArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  description: string;
  amenities?: string;
  images: { url: string; position: number }[];
  featured: boolean;
  createdAt: string;
};

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) { super(message); }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window === "undefined" ? null : sessionStorage.getItem(adminTokenStorageKey);
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    if (response.status === 401 && typeof window !== "undefined") sessionStorage.removeItem(adminTokenStorageKey);
    throw new ApiError(body?.message ?? "No se pudo completar la solicitud.", response.status);
  }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>;
}

export async function login(username: string, password: string) {
  return request<{ token: string; expiresIn: number }>("/api/auth/login", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }),
  });
}

export function publicImageUrl(url?: string) { return url ? (url.startsWith("http") ? url : `${apiUrl}${url}`) : "/image1.webp"; }
export const getPublicProperties = () => request<ApiProperty[]>("/api/properties");
export const getPublicProperty = (slug: string) => request<ApiProperty>(`/api/properties/${encodeURIComponent(slug)}`);
export const getAdminProperties = () => request<ApiProperty[]>("/api/admin/properties");
export const getAdminProperty = (id: string) => request<ApiProperty>(`/api/admin/properties/${encodeURIComponent(id)}`);
export const deleteAdminProperty = (id: string) => request<void>(`/api/admin/properties/${encodeURIComponent(id)}`, { method: "DELETE" });
export const createAdminProperty = (data: FormData) => request<ApiProperty>("/api/admin/properties", { method: "POST", body: data });
export const updateAdminProperty = (id: string, data: FormData) => request<ApiProperty>(`/api/admin/properties/${encodeURIComponent(id)}`, { method: "PATCH", body: data });
