import { z } from "zod";
import { adminProcedure, roleProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import { getDb } from "./db";
import { grantPermissionToUser, revokePermissionFromUser, initializeDefaultPermissions } from "./_core/rbac";

export const adminRouter = router({
  // Initialize RBAC system
  initializeRBAC: adminProcedure.mutation(async () => {
    try {
      await initializeDefaultPermissions();
      return {
        success: true,
        message: "RBAC system initialized successfully",
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to initialize RBAC system",
      });
    }
  }),

  // Get all users
  getAllUsers: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    try {
      return await db.select().from(users);
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch users",
      });
    }
  }),

  // Get user by ID
  getUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        const result = await db
          .select()
          .from(users)
          .where(eq(users.id, input.userId))
          .limit(1);

        if (result.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        return result[0];
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user",
        });
      }
    }),

  // Update user role
  updateUserRole: adminProcedure
    .input(z.object({
      userId: z.number(),
      role: z.enum(["user", "admin", "patient", "doctor", "hospital", "insurance"]),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        await db
          .update(users)
          .set({ role: input.role })
          .where(eq(users.id, input.userId));

        return {
          success: true,
          message: `User role updated to ${input.role}`,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update user role",
        });
      }
    }),

  // Deactivate user
  deactivateUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        await db
          .update(users)
          .set({ isActive: false })
          .where(eq(users.id, input.userId));

        return {
          success: true,
          message: "User deactivated successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to deactivate user",
        });
      }
    }),

  // Activate user
  activateUser: adminProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        await db
          .update(users)
          .set({ isActive: true })
          .where(eq(users.id, input.userId));

        return {
          success: true,
          message: "User activated successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to activate user",
        });
      }
    }),

  // Grant permission to user
  grantPermission: adminProcedure
    .input(z.object({
      userId: z.number(),
      permission: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const success = await grantPermissionToUser(
          input.userId,
          input.permission,
          ctx.user!.id
        );

        if (!success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to grant permission",
          });
        }

        return {
          success: true,
          message: `Permission '${input.permission}' granted to user`,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to grant permission",
        });
      }
    }),

  // Revoke permission from user
  revokePermission: adminProcedure
    .input(z.object({
      userId: z.number(),
      permission: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const success = await revokePermissionFromUser(input.userId, input.permission);

        if (!success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to revoke permission",
          });
        }

        return {
          success: true,
          message: `Permission '${input.permission}' revoked from user`,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to revoke permission",
        });
      }
    }),

  // Get users by role
  getUsersByRole: adminProcedure
    .input(z.object({
      role: z.enum(["user", "admin", "patient", "doctor", "hospital", "insurance"]),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      try {
        return await db
          .select()
          .from(users)
          .where(eq(users.role, input.role));
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch users",
        });
      }
    }),
});
