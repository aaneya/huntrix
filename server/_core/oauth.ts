import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { googleOAuth, githubOAuth, generateOAuthState, validateOAuthState } from "./socialOAuth";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  // Manus OAuth callback
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });

  // Google OAuth login initiation
  app.get("/api/oauth/google/login", (req: Request, res: Response) => {
    try {
      const state = generateOAuthState();
      res.cookie("oauth_state", state, { httpOnly: true, maxAge: 10 * 60 * 1000 });
      const authUrl = googleOAuth.getAuthorizationUrl(state);
      res.redirect(authUrl);
    } catch (error) {
      console.error("[Google OAuth] Login initiation failed", error);
      res.status(500).json({ error: "Google OAuth login failed" });
    }
  });

  // Google OAuth callback
  app.get("/api/oauth/google/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    const storedState = req.cookies.oauth_state;

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    if (!validateOAuthState(state, storedState)) {
      res.status(400).json({ error: "Invalid state parameter" });
      return;
    }

    try {
      const tokenResponse = await googleOAuth.exchangeCodeForToken(code);
      const userInfo = await googleOAuth.getUserInfo(tokenResponse.accessToken);

      await db.upsertUser({
        openId: `google_${userInfo.id}`,
        name: userInfo.name,
        email: userInfo.email,
        loginMethod: "google",
        lastSignedIn: new Date(),
      });

      console.log("[Google OAuth] User logged in:", userInfo.email);

      const sessionToken = await sdk.createSessionToken(`google_${userInfo.id}`, {
        name: userInfo.name,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.clearCookie("oauth_state");

      res.redirect(302, "/");
    } catch (error) {
      console.error("[Google OAuth] Callback failed", error);
      res.status(500).json({ error: "Google OAuth callback failed" });
    }
  });

  // GitHub OAuth login initiation
  app.get("/api/oauth/github/login", (req: Request, res: Response) => {
    try {
      const state = generateOAuthState();
      res.cookie("oauth_state", state, { httpOnly: true, maxAge: 10 * 60 * 1000 });
      const authUrl = githubOAuth.getAuthorizationUrl(state);
      res.redirect(authUrl);
    } catch (error) {
      console.error("[GitHub OAuth] Login initiation failed", error);
      res.status(500).json({ error: "GitHub OAuth login failed" });
    }
  });

  // GitHub OAuth callback
  app.get("/api/oauth/github/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    const storedState = req.cookies.oauth_state;

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    if (!validateOAuthState(state, storedState)) {
      res.status(400).json({ error: "Invalid state parameter" });
      return;
    }

    try {
      const tokenResponse = await githubOAuth.exchangeCodeForToken(code);
      const userInfo = await githubOAuth.getUserInfo(tokenResponse.accessToken);

      await db.upsertUser({
        openId: `github_${userInfo.id}`,
        name: userInfo.name,
        email: userInfo.email,
        loginMethod: "github",
        lastSignedIn: new Date(),
      });

      console.log("[GitHub OAuth] User logged in:", userInfo.login);

      const sessionToken = await sdk.createSessionToken(`github_${userInfo.id}`, {
        name: userInfo.name,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.clearCookie("oauth_state");

      res.redirect(302, "/");
    } catch (error) {
      console.error("[GitHub OAuth] Callback failed", error);
      res.status(500).json({ error: "GitHub OAuth callback failed" });
    }
  });
}
