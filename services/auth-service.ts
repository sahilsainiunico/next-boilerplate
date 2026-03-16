import { apiClient } from "@/services/api-client";
import { useAuthStore } from "@/store/auth-store";
import type { User, AuthTokens, LoginCredentials, RegisterCredentials } from "@/types";
import { ENDPOINTS } from "@/config/endpoints";

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<boolean> {
    const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials, {
      skipAuth: true,
    });

    if (response.ok && response.data) {
      useAuthStore.getState().login(response.data.user, response.data.tokens);
      return true;
    }

    return false;
  },

  async register(credentials: RegisterCredentials): Promise<boolean> {
    const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, credentials, {
      skipAuth: true,
    });

    if (response.ok && response.data) {
      useAuthStore.getState().login(response.data.user, response.data.tokens);
      return true;
    }

    return false;
  },

  async logout(): Promise<void> {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT, null, { skipErrorToast: true });
    useAuthStore.getState().logout();
  },

  async getProfile(): Promise<User | null> {
    const response = await apiClient.get<User>(ENDPOINTS.AUTH.ME);

    if (response.ok && response.data) {
      useAuthStore.getState().setUser(response.data);
      return response.data;
    }

    return null;
  },
};
