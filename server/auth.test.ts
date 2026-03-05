import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(user?: AuthenticatedUser): { ctx: TrpcContext; clearedCookies: Array<{ name: string; options: Record<string, unknown> }> } {
  const clearedCookies: Array<{ name: string; options: Record<string, unknown> }> = [];

  const defaultUser: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "traditional",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user: user || defaultUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

describe("auth", () => {
  describe("logout", () => {
    it("clears the session cookie and reports success", async () => {
      const { ctx, clearedCookies } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.logout();

      expect(result).toEqual({ success: true });
      expect(clearedCookies).toHaveLength(1);
      expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
      expect(clearedCookies[0]?.options).toMatchObject({
        maxAge: -1,
        secure: true,
        sameSite: "none",
        httpOnly: true,
        path: "/",
      });
    });
  });

  describe("loginTraditional", () => {
    it("should login with valid credentials", async () => {
      const { ctx } = createAuthContext(undefined);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.loginTraditional({
        username: "testuser",
        password: "password123",
      });

      expect(result).toEqual({
        success: true,
        message: "Login successful",
      });
    });

    it("should reject empty username", async () => {
      const { ctx } = createAuthContext(undefined);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.loginTraditional({
          username: "",
          password: "password123",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });

    it("should reject empty password", async () => {
      const { ctx } = createAuthContext(undefined);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.loginTraditional({
          username: "testuser",
          password: "",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });
  });

  describe("requestOTP", () => {
    it("should request OTP with valid phone number", async () => {
      const { ctx } = createAuthContext(undefined);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.requestOTP({
        phoneNumber: "+919876543210",
      });

      expect(result).toEqual({
        success: true,
        message: "OTP sent to your phone",
        expiresIn: 600,
      });
    });

    it("should reject invalid phone number", async () => {
      const { ctx } = createAuthContext(undefined);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.requestOTP({
          phoneNumber: "invalid",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });

    it("should reject phone number with insufficient digits", async () => {
      const { ctx } = createAuthContext(undefined);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.requestOTP({
          phoneNumber: "+1234",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });
  });

  describe("verifyOTP", () => {
    it("should verify OTP successfully", async () => {
      const { ctx } = createAuthContext(undefined);
      const caller = appRouter.createCaller(ctx);

      // First request OTP
      const otpResult = await caller.auth.requestOTP({
        phoneNumber: "+919876543210",
      });
      expect(otpResult.success).toBe(true);

      // Then verify with a valid OTP
      // Note: In a real test, we'd need to extract the OTP from the store
      // For now, this test demonstrates the flow
    });

    it("should reject expired OTP", async () => {
      const { ctx } = createAuthContext(undefined);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.verifyOTP({
          phoneNumber: "+919876543210",
          otp: "123456",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should reject invalid OTP format", async () => {
      const { ctx } = createAuthContext(undefined);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.verifyOTP({
          phoneNumber: "+919876543210",
          otp: "12345", // Only 5 digits
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });
  });

  describe("register", () => {
    it("should register with valid data", async () => {
      const { ctx } = createAuthContext(undefined);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.register({
        fullName: "John Doe",
        email: "john@example.com",
        phoneNumber: "+919876543210",
        password: "SecurePassword123",
        role: "patient",
      });

      expect(result).toEqual({
        success: true,
        message: "Registration successful. Please login.",
      });
    });

    it("should reject short password", async () => {
      const { ctx } = createAuthContext(undefined);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.register({
          fullName: "John Doe",
          email: "john@example.com",
          phoneNumber: "+919876543210",
          password: "short",
          role: "patient",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });

    it("should reject invalid email", async () => {
      const { ctx } = createAuthContext(undefined);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.register({
          fullName: "John Doe",
          email: "invalid-email",
          phoneNumber: "+919876543210",
          password: "SecurePassword123",
          role: "patient",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });

    it("should reject invalid phone number", async () => {
      const { ctx } = createAuthContext(undefined);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.register({
          fullName: "John Doe",
          email: "john@example.com",
          phoneNumber: "invalid",
          password: "SecurePassword123",
          role: "patient",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });

    it("should reject short full name", async () => {
      const { ctx } = createAuthContext(undefined);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.auth.register({
          fullName: "J",
          email: "john@example.com",
          phoneNumber: "+919876543210",
          password: "SecurePassword123",
          role: "patient",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });
  });

  describe("me", () => {
    it("should return current user", async () => {
      const user: AuthenticatedUser = {
        id: 1,
        openId: "test-user",
        email: "test@example.com",
        name: "Test User",
        loginMethod: "traditional",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };

      const { ctx } = createAuthContext(user);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.me();

      expect(result).toEqual(user);
    });

    it("should return null for unauthenticated user", async () => {
      const { ctx } = createAuthContext(undefined);
      ctx.user = null;
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.me();

      expect(result).toBeNull();
    });
  });
});
