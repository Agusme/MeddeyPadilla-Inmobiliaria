"use client";

import { useSyncExternalStore } from "react";
import { isAdminAuthenticated } from "./adminAuth";

function subscribe(onChange: () => void) {
  window.addEventListener("admin-auth-change", onChange);
  window.addEventListener("storage", onChange);
  window.addEventListener("focus", onChange);
  return () => {
    window.removeEventListener("admin-auth-change", onChange);
    window.removeEventListener("storage", onChange);
    window.removeEventListener("focus", onChange);
  };
}

function getServerSnapshot(): boolean | null { return null; }

export function useAdminAuthenticated() {
  return useSyncExternalStore(subscribe, isAdminAuthenticated, getServerSnapshot);
}
