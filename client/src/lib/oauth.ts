/**
 * OAuth helper functions for client-side authentication
 */

export const oauthProviders = {
  google: {
    name: "Google",
    loginUrl: "/api/oauth/google/login",
    icon: "🔍",
  },
  github: {
    name: "GitHub",
    loginUrl: "/api/oauth/github/login",
    icon: "🐙",
  },
};

/**
 * Initiate OAuth login flow
 */
export function initiateOAuthLogin(provider: "google" | "github"): void {
  const loginUrl = oauthProviders[provider].loginUrl;
  window.location.href = loginUrl;
}

/**
 * Check if user is authenticated via OAuth
 */
export function isOAuthAuthenticated(): boolean {
  // Check if user has a valid session cookie
  const cookies = document.cookie.split(";");
  return cookies.some((cookie) => cookie.trim().startsWith("session="));
}

/**
 * Get OAuth provider from login method
 */
export function getOAuthProvider(loginMethod: string): string | null {
  if (loginMethod?.includes("google")) return "google";
  if (loginMethod?.includes("github")) return "github";
  return null;
}
