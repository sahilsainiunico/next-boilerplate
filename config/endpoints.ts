/**
 * Replaces mustache-style `{{key}}` placeholders with values from the params object.
 *
 * @example
 * interpolate("/users/{{id}}/posts/{{postId}}", { id: "42", postId: "7" })
 * // => "/users/42/posts/7"
 */
export function interpolate(
  template: string,
  params: Record<string, string | number>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    if (!(key in params)) {
      throw new Error(`Missing endpoint parameter: {{${key}}}`);
    }
    return String(params[key]);
  });
}

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
  },
  USERS: {
    LIST: "/users",
    DETAIL: "/users/{{id}}",
    UPDATE: "/users/{{id}}",
    DELETE: "/users/{{id}}",
  },
} as const;
