import { preparePropertyImages } from "./preparePropertyImages";
import { UserMessageError, userErrorMessage } from "./userMessages";

export const adminTokenStorageKey = "medde-padilla-admin-token";
export const adminSessionNoticeKey = "medde-padilla-admin-session-notice";

// In Vercel, browser requests use the shared public domain and are routed to
// the backend by vercel.json. Keep the configurable URL for local development.
const apiUrl = (process.env.NODE_ENV === "development"
  ? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
  : "").replace(/\/$/, "");

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
  floors?: number;
  hasExpenses?: boolean;
  expenses?: number;
  balcony?: boolean;
  serviceRoom?: boolean;
  backyard?: boolean;
  patio?: boolean;
  laundryRoom?: boolean;
  grill?: boolean;
  quincho?: boolean;
  pool?: boolean;
  kitchen?: boolean;
  livingRoom?: boolean;
  diningRoom?: boolean;
  toilette?: boolean;
  furnished?: boolean;
  description: string;
  hasAmenities?: boolean;
  amenities?: string;
  images: { url: string; position: number }[];
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
};

export class ApiError extends UserMessageError {
  constructor(message: string, public readonly status: number, public readonly missingDigests: string[] = [], public readonly outcomeUncertain = false) { super(message); }
}

export function propertyMutationNotice(error: unknown, action: "save" | "delete") {
  const saving = action === "save";
  const uncertain = error instanceof ApiError && error.outcomeUncertain;
  return {
    title: uncertain ? (saving ? "Guardado sin confirmar" : "Eliminación sin confirmar")
      : (saving ? "No pudimos guardar la propiedad" : "No pudimos eliminar la propiedad"),
    text: userErrorMessage(error, actionMessages[action]),
    icon: uncertain ? "warning" as const : "error" as const,
    confirmButtonText: "Entendido",
  };
}

type RequestAction = "load" | "login" | "save" | "delete" | "upload";

const actionMessages: Record<RequestAction, string> = {
  load: "No pudimos cargar la información. Intentá nuevamente en unos minutos.",
  login: "No pudimos iniciar sesión. Intentá nuevamente en unos minutos.",
  save: "No pudimos guardar la propiedad. Revisá los datos e intentá nuevamente.",
  delete: "No pudimos eliminar la propiedad. Volvé al listado e intentá nuevamente.",
  upload: "No pudimos preparar la subida de fotos. Intentá nuevamente.",
};

async function request<T>(path: string, init: RequestInit = {}, action: RequestAction = "load"): Promise<T> {
  const mutation = action === "save" || action === "delete";
  const verifyOutcome = action === "save"
    ? "Revisá si la propiedad se guardó antes de reintentar."
    : "Revisá si la propiedad sigue en el listado antes de reintentar.";
  const token = typeof window === "undefined" ? null : sessionStorage.getItem(adminTokenStorageKey);
  let response: Response;
  try {
    response = await fetch(`${apiUrl}${path}`, {
      ...init,
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
    });
  } catch {
    const message = "No pudimos conectar con el servidor. Revisá tu conexión";
    throw new ApiError(mutation ? `${message}. ${verifyOutcome}` : `${message} e intentá nuevamente.`, 0, [], mutation);
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    if (response.status === 401 && action !== "login" && token && typeof window !== "undefined") {
      sessionStorage.removeItem(adminTokenStorageKey);
      sessionStorage.setItem(adminSessionNoticeKey, "Tu sesión venció. Iniciá sesión nuevamente.");
      window.dispatchEvent(new Event("admin-auth-change"));
    }
    const approvedMessage = typeof body?.userMessage === "string" && body.userMessage.trim() ? body.userMessage : undefined;
    const uncertain = mutation && (body?.outcomeUncertain === true || response.status === 408 || response.status === 504
      || (response.status >= 500 && !approvedMessage));
    let fallback = actionMessages[action];
    if (response.status === 401) fallback = action === "login" ? "El usuario o la contraseña son incorrectos."
      : "Tu sesión venció. Iniciá sesión nuevamente.";
    if (response.status === 404 && path.startsWith("/api/admin/properties/") && action !== "upload" && !path.includes("/upload-sessions/")) {
      fallback = "No encontramos la propiedad. Volvé al listado.";
    }
    if (response.status === 413) fallback = "El envío supera el tamaño permitido. Probá con menos fotos o con archivos más livianos.";
    if (response.status === 408 || response.status === 504) fallback = "El servidor tardó demasiado en responder.";
    const missing = Array.isArray(body?.missingDigests) ? body.missingDigests.filter((item: unknown): item is string => typeof item === "string") : [];
    const message = uncertain
      ? `${response.status === 408 || response.status === 504 ? fallback : "No pudimos confirmar el resultado."} ${verifyOutcome}`
      : approvedMessage ?? (response.status === 408 || response.status === 504 ? `${fallback} Intentá nuevamente.` : fallback);
    throw new ApiError(message, response.status, missing, uncertain);
  }
  if (response.status === 204 && action !== "save") return undefined as T;
  try {
    const body = await response.json();
    if ((action === "save" && typeof body?._id !== "string") || action === "delete") {
      throw new Error("Respuesta sin confirmación de la operación");
    }
    return body as T;
  } catch {
    throw new ApiError(mutation ? `No pudimos confirmar el resultado. ${verifyOutcome}` : actionMessages[action], response.status, [], mutation);
  }
}

export async function login(username: string, password: string) {
  return request<{ token: string; expiresIn: number }>("/api/auth/login", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }),
  }, "login");
}

export function publicImageUrl(url?: string) { return url ? (url.startsWith("http") ? url : `${apiUrl}${url}`) : "/image1.webp"; }
export type PublicPropertyFilters = {
  type?: string;
  operation?: string;
};

export const getPublicProperties = (filters: PublicPropertyFilters = {}) => {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.operation) params.set("operation", filters.operation);
  const queryString = params.toString();
  const query = queryString ? `?${queryString}` : "";
  return request<ApiProperty[]>(`/api/properties${query}`);
};
export const getAdminProperties = () => request<ApiProperty[]>("/api/admin/properties");
export const getAdminProperty = (id: string) => request<ApiProperty>(`/api/admin/properties/${encodeURIComponent(id)}`);
export const deleteAdminProperty = (id: string) => request<void>(`/api/admin/properties/${encodeURIComponent(id)}`, { method: "DELETE" }, "delete");
export const createAdminProperty = async (data: FormData) => request<ApiProperty>("/api/admin/properties", { method: "POST", body: await preparePropertyImages(data) }, "save");
export const updateAdminProperty = async (id: string, data: FormData) => request<ApiProperty>(`/api/admin/properties/${encodeURIComponent(id)}`, { method: "PATCH", body: await preparePropertyImages(data) }, "save");

export type SignedPropertyUpload = {
  digest: string;
  url: string;
  fields: Record<string, string | number | boolean>;
};

function postPropertyUpload<T>(id: string, body: unknown, save = false) {
  return request<T>(`/api/admin/properties/upload-sessions/${id}${save ? "/save" : ""}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }, save ? "save" : "upload");
}

export const authorizePropertyUploads = (
  id: string, body: { propertyId?: string; revision?: string; files: { digest: string; size: number; type: string }[] },
) => postPropertyUpload<{ uploads: SignedPropertyUpload[] }>(id, body);

export const saveAuthorizedProperty = (id: string, body: { fields: Record<string, string>; order: string[] }) =>
  postPropertyUpload<ApiProperty>(id, body, true);
