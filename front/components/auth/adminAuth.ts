import { adminTokenStorageKey, login } from "@/lib/api";

export async function authenticateAdmin(username: string, password: string) {
  const { token } = await login(username, password);
  window.sessionStorage.setItem(adminTokenStorageKey, token);
}

export function isAdminAuthenticated() {
  return (
    typeof window !== "undefined" &&
    Boolean(window.sessionStorage.getItem(adminTokenStorageKey))
  );
}
