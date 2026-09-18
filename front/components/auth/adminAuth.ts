export const adminAuthStorageKey = "medde-padilla-admin-session";
export const adminUsername = "admin";
export const adminPassword = "admin123";

export function authenticateAdmin(username: string, password: string) {
  if (username !== adminUsername || password !== adminPassword) return false;

  window.sessionStorage.setItem(adminAuthStorageKey, "authenticated");
  return true;
}

export function isAdminAuthenticated() {
  return (
    typeof window !== "undefined" &&
    window.sessionStorage.getItem(adminAuthStorageKey) === "authenticated"
  );
}
