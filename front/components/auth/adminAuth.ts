import { adminTokenStorageKey, login } from "@/lib/api";

export async function authenticateAdmin(username: string, password: string) {
  const { token } = await login(username, password);
  window.sessionStorage.setItem(adminTokenStorageKey, token);
  window.dispatchEvent(new Event("admin-auth-change"));
}

export function isAdminAuthenticated() {
  return (
    typeof window !== "undefined" &&
    Boolean(window.sessionStorage.getItem(adminTokenStorageKey))
  );
}

export function logoutAdmin() {
  window.sessionStorage.removeItem(adminTokenStorageKey);
  window.dispatchEvent(new Event("admin-auth-change"));
}
