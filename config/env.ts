function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  app: {
    url: getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
    name: getEnvVar("NEXT_PUBLIC_APP_NAME", "Next Boilerplate"),
  },
  api: {
    baseUrl: getEnvVar("NEXT_PUBLIC_API_BASE_URL", "http://localhost:3000/api"),
  },
} as const;
