export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
  },
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
  DEMO: {
    INDEX: "/demo",
    ERROR: "/demo/error",
    NOT_FOUND: "/demo/not-found",
    LOADING: "/demo/loading",
    GLOBAL_ERROR: "/demo/global-error",
  },
} as const;
