"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/config/routes";

interface AuthLayoutProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthLayout({ children, fallback }: AuthLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.AUTH.LOGIN);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return fallback ?? null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
