import { ENV } from "./env";
import axios from "axios";

/**
 * Google OAuth configuration and utilities
 */
export const googleOAuth = {
  clientId: ENV.googleClientId,
  clientSecret: ENV.googleClientSecret,
  redirectUri: `${process.env.APP_URL || "http://localhost:5173"}/api/oauth/google/callback`,

  /**
   * Get Google OAuth authorization URL
   */
  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: "openid profile email",
      state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  },

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForToken(code: string): Promise<{
    accessToken: string;
    idToken: string;
    expiresIn: number;
  }> {
    try {
      const response = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: "authorization_code",
      });

      return {
        accessToken: response.data.access_token,
        idToken: response.data.id_token,
        expiresIn: response.data.expires_in,
      };
    } catch (error) {
      console.error("[Google OAuth] Failed to exchange code for token:", error);
      throw error;
    }
  },

  /**
   * Get user info from Google
   */
  async getUserInfo(accessToken: string): Promise<{
    id: string;
    email: string;
    name: string;
    picture?: string;
  }> {
    try {
      const response = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return {
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        picture: response.data.picture,
      };
    } catch (error) {
      console.error("[Google OAuth] Failed to get user info:", error);
      throw error;
    }
  },
};

/**
 * GitHub OAuth configuration and utilities
 */
export const githubOAuth = {
  clientId: ENV.githubClientId,
  clientSecret: ENV.githubClientSecret,
  redirectUri: `${process.env.APP_URL || "http://localhost:5173"}/api/oauth/github/callback`,

  /**
   * Get GitHub OAuth authorization URL
   */
  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: "user:email",
      state,
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  },

  /**
   * Exchange authorization code for token
   */
  async exchangeCodeForToken(code: string): Promise<{
    accessToken: string;
    tokenType: string;
  }> {
    try {
      const response = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          redirect_uri: this.redirectUri,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.data.error) {
        throw new Error(response.data.error_description || response.data.error);
      }

      return {
        accessToken: response.data.access_token,
        tokenType: response.data.token_type,
      };
    } catch (error) {
      console.error("[GitHub OAuth] Failed to exchange code for token:", error);
      throw error;
    }
  },

  /**
   * Get user info from GitHub
   */
  async getUserInfo(accessToken: string): Promise<{
    id: number;
    login: string;
    name: string;
    email: string;
    avatar_url?: string;
  }> {
    try {
      const response = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      // Get email if not public
      let email = response.data.email;
      if (!email) {
        const emailResponse = await axios.get("https://api.github.com/user/emails", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        const primaryEmail = emailResponse.data.find((e: any) => e.primary);
        email = primaryEmail?.email || response.data.login + "@github.local";
      }

      return {
        id: response.data.id,
        login: response.data.login,
        name: response.data.name || response.data.login,
        email,
        avatar_url: response.data.avatar_url,
      };
    } catch (error) {
      console.error("[GitHub OAuth] Failed to get user info:", error);
      throw error;
    }
  },
};

/**
 * Generate OAuth state token for CSRF protection
 */
export function generateOAuthState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Validate OAuth state token
 */
export function validateOAuthState(state: string, storedState: string): boolean {
  return state === storedState;
}
