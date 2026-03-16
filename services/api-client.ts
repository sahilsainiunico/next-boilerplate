import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import type { ApiResponse, RequestConfig } from "@/types";
import { env } from "@/config/env";
import { ENDPOINTS } from "@/config/endpoints";

const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_RETRIES = 2;
const RETRY_DELAY = 1_000;

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const { tokens, updateAccessToken, logout } = useAuthStore.getState();

  if (!tokens?.refreshToken) {
    logout();
    return false;
  }

  try {
    const response = await fetch(`${env.api.baseUrl}${ENDPOINTS.AUTH.REFRESH}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    });

    if (!response.ok) {
      logout();
      return false;
    }

    const data = await response.json();
    updateAccessToken(data.accessToken, data.expiresAt);
    return true;
  } catch {
    logout();
    return false;
  }
}

async function handleTokenRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = refreshAccessToken().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });

  return refreshPromise;
}

function getAuthHeaders(): Record<string, string> {
  const { tokens } = useAuthStore.getState();
  if (!tokens?.accessToken) return {};
  return { Authorization: `Bearer ${tokens.accessToken}` };
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
  const {
    params,
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    skipAuth = false,
    skipErrorToast = false,
    headers: customHeaders,
    ...fetchConfig
  } = config;

  let url = endpoint.startsWith("http") ? endpoint : `${env.api.baseUrl}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams(params);
    url = `${url}?${searchParams.toString()}`;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(!skipAuth ? getAuthHeaders() : {}),
    ...(customHeaders as Record<string, string>),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 — attempt token refresh
      if (response.status === 401 && !skipAuth) {
        const refreshed = await handleTokenRefresh();

        if (refreshed) {
          const newHeaders = { ...headers, ...getAuthHeaders() };
          const retryResponse = await fetch(url, {
            ...fetchConfig,
            headers: newHeaders,
          });

          if (retryResponse.ok) {
            const data = await retryResponse.json();
            return {
              data: data.data ?? data,
              error: null,
              message: data.message ?? "Success",
              status: retryResponse.status,
              ok: true,
            };
          }
        }

        if (!skipErrorToast) {
          toast.error("Session expired. Please log in again.");
        }

        return {
          data: null,
          error: "Unauthorized",
          message: "Session expired",
          status: 401,
          ok: false,
        };
      }

      // Parse response
      let body: Record<string, unknown>;
      try {
        body = await response.json();
      } catch {
        body = {};
      }

      if (!response.ok) {
        const errorMessage =
          (body.message as string) ??
          (body.error as string) ??
          `Request failed with status ${response.status}`;

        if (!skipErrorToast) {
          toast.error(errorMessage);
        }

        return {
          data: null,
          error: errorMessage,
          message: errorMessage,
          status: response.status,
          ok: false,
        };
      }

      return {
        data: (body.data as T) ?? (body as unknown as T),
        error: null,
        message: (body.message as string) ?? "Success",
        status: response.status,
        ok: true,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error instanceof Error ? error : new Error(String(error));

      if (lastError.name === "AbortError") {
        if (!skipErrorToast) {
          toast.error("Request timed out. Please try again.");
        }
        return {
          data: null,
          error: "Request timed out",
          message: "Request timed out",
          status: 408,
          ok: false,
        };
      }

      // Retry with exponential backoff
      if (attempt < retries) {
        await sleep(RETRY_DELAY * (attempt + 1));
        continue;
      }
    }
  }

  const errorMessage = lastError?.message ?? "An unexpected error occurred";
  if (!skipErrorToast) {
    toast.error(errorMessage);
  }

  return {
    data: null,
    error: errorMessage,
    message: errorMessage,
    status: 0,
    ok: false,
  };
}

export const apiClient = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "GET" }),

  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "DELETE" }),
};
