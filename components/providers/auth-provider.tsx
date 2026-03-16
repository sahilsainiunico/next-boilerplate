"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth-service";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, setLoading } = useAuthStore();

  useEffect(() => {
    async function validateSession() {
      if (isAuthenticated) {
        await authService.getProfile();
      }
      setLoading(false);
    }

    validateSession();
  }, [isAuthenticated, setLoading]);

  return <>{children}</>;
}
