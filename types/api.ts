export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  message: string;
  status: number;
  ok: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
  timeout?: number;
  retries?: number;
  skipAuth?: boolean;
  skipErrorToast?: boolean;
}
