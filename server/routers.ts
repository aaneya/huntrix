import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { upsertUser } from "./db";
import { TRPCError } from "@trpc/server";
import {
  createMedicalRecord,
  getMedicalRecordsByPatient,
  getMedicalRecordById,
  verifyMedicalRecord,
  logRecordAccess,
  getAccessLogs,
  getBlockchainHashForRecord,
  shareRecordWithUser,
  getSharedRecordsForUser,
  checkRecordAccess,
  getRecordsSharedByPatient,
  revokeRecordAccess,
} from "./medicalRecords";
import { sendOTPViaSMS as sendOTPViaTwilio } from "./_core/sms";
import { adminRouter } from "./adminRouter";

// Store OTPs in memory (in production, use Redis or database)
const otpStore = new Map<string, { code: string; expiresAt: number; attempts: number }>();

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPViaSMS(phoneNumber: string, otp: string): Promise<boolean> {
  try {
    return await sendOTPViaTwilio(phoneNumber, otp);
  } catch (error) {
    console.error("[SMS] Failed to send OTP:", error);
    return false;
  }
}

export const appRouter = router({
  system: systemRouter,
  admin: adminRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),

    loginTraditional: publicProcedure
      .input(z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
      }))
      .mutation(async ({ input }) => {
        try {
          if (!input.username || !input.password) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid credentials",
            });
          }

          const user = {
            openId: `user_${input.username}`,
            name: input.username,
            email: input.username.includes("@") ? input.username : `${input.username}@medivault.local`,
            loginMethod: "traditional",
            lastSignedIn: new Date(),
          };

          await upsertUser(user);

          return {
            success: true,
            message: "Login successful",
          };
        } catch (error) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid credentials",
          });
        }
      }),

    requestOTP: publicProcedure
      .input(z.object({
        phoneNumber: z.string().regex(/^\+?[0-9]{10,}$/, "Invalid phone number"),
      }))
      .mutation(async ({ input }) => {
        try {
          const otp = generateOTP();
          const expiresAt = Date.now() + 10 * 60 * 1000;

          otpStore.set(input.phoneNumber, {
            code: otp,
            expiresAt,
            attempts: 0,
          });

          const sent = await sendOTPViaSMS(input.phoneNumber, otp);

          if (!sent) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to send OTP",
            });
          }

          return {
            success: true,
            message: "OTP sent to your phone",
            expiresIn: 600,
          };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send OTP",
          });
        }
      }),

    verifyOTP: publicProcedure
      .input(z.object({
        phoneNumber: z.string().regex(/^\+?[0-9]{10,}$/, "Invalid phone number"),
        otp: z.string().length(6, "OTP must be 6 digits"),
        name: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const storedOTP = otpStore.get(input.phoneNumber);

          if (!storedOTP) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "OTP not found or expired",
            });
          }

          if (Date.now() > storedOTP.expiresAt) {
            otpStore.delete(input.phoneNumber);
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "OTP has expired",
            });
          }

          if (storedOTP.code !== input.otp) {
            storedOTP.attempts += 1;
            if (storedOTP.attempts >= 3) {
              otpStore.delete(input.phoneNumber);
              throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Too many failed attempts. Please request a new OTP.",
              });
            }
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: `Invalid OTP. ${3 - storedOTP.attempts} attempts remaining.`,
            });
          }

          const user = {
            openId: `otp_${input.phoneNumber}`,
            name: input.name || `User_${input.phoneNumber}`,
            email: `${input.phoneNumber}@medivault.local`,
            loginMethod: "otp",
            lastSignedIn: new Date(),
          };

          await upsertUser(user);
          otpStore.delete(input.phoneNumber);

          return {
            success: true,
            message: "OTP verified successfully",
          };
        } catch (error) {
          if (error instanceof TRPCError) {
            throw error;
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "OTP verification failed",
          });
        }
      }),

    register: publicProcedure
      .input(z.object({
        fullName: z.string().min(2, "Full name is required"),
        email: z.string().email("Invalid email"),
        phoneNumber: z.string().regex(/^\+?[0-9]{10,}$/, "Invalid phone number"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        role: z.enum(["patient", "doctor", "hospital", "insurance"]),
        dateOfBirth: z.string().optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        address: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const user = {
            openId: `user_${input.email}`,
            name: input.fullName,
            email: input.email,
            loginMethod: "traditional",
            lastSignedIn: new Date(),
          };

          await upsertUser(user);

          return {
            success: true,
            message: "Registration successful. Please login.",
          };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Registration failed",
          });
        }
      }),
  }),

  medicalRecords: router({
    upload: protectedProcedure
      .input(z.object({
        patientId: z.number(),
        recordType: z.string(),
        title: z.string(),
        description: z.string().optional(),
        fileUrl: z.string(),
        fileKey: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const result = await createMedicalRecord({
            patientId: input.patientId,
            doctorId: ctx.user?.id,
            recordType: input.recordType,
            title: input.title,
            description: input.description,
            fileUrl: input.fileUrl,
            fileKey: input.fileKey,
          });

          if (!result) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to upload medical record",
            });
          }

          await logRecordAccess(result.id, ctx.user!.id, "view");

          return {
            success: true,
            recordId: result.id,
            blockchainHash: result.blockchainHash,
          };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to upload medical record",
          });
        }
      }),

    list: protectedProcedure
      .input(z.object({ patientId: z.number() }))
      .query(async ({ input }) => {
        try {
          return await getMedicalRecordsByPatient(input.patientId);
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch medical records",
          });
        }
      }),

    get: protectedProcedure
      .input(z.object({ recordId: z.number() }))
      .query(async ({ input, ctx }) => {
        try {
          const record = await getMedicalRecordById(input.recordId);
          if (!record) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Record not found" });
          }
          await logRecordAccess(input.recordId, ctx.user!.id, "view");
          return record;
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch medical record",
          });
        }
      }),

    verify: protectedProcedure
      .input(z.object({ recordId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        try {
          const verified = await verifyMedicalRecord(input.recordId);
          await logRecordAccess(input.recordId, ctx.user!.id, "verify");
          if (!verified) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to verify medical record",
            });
          }
          return { success: true, message: "Medical record verified successfully" };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to verify medical record",
          });
        }
      }),

    accessLogs: protectedProcedure
      .input(z.object({ recordId: z.number() }))
      .query(async ({ input }) => {
        try {
          return await getAccessLogs(input.recordId);
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch access logs",
          });
        }
      }),

    getBlockchainHash: protectedProcedure
      .input(z.object({ recordId: z.number() }))
      .query(async ({ input, ctx }) => {
        try {
          const record = await getMedicalRecordById(input.recordId);
          if (!record) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Record not found" });
          }

          const hasAccess = await checkRecordAccess(input.recordId, ctx.user!.id, ctx.user!.role);
          if (!hasAccess) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You do not have access to this record",
            });
          }

          const blockchainHash = await getBlockchainHashForRecord(input.recordId);
          await logRecordAccess(input.recordId, ctx.user!.id, "view");

          return blockchainHash;
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch blockchain hash",
          });
        }
      }),

    share: protectedProcedure
      .input(z.object({
        recordId: z.number(),
        grantedToUserId: z.number(),
        accessLevel: z.enum(["view", "download", "share"]).default("view"),
        expiresInDays: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const record = await getMedicalRecordById(input.recordId);
          if (!record) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Record not found" });
          }

          if (record.patientId !== ctx.user!.id && record.doctorId !== ctx.user!.id) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You do not have permission to share this record",
            });
          }

          const expiresAt = input.expiresInDays
            ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
            : undefined;

          const success = await shareRecordWithUser(
            input.recordId,
            record.patientId,
            input.grantedToUserId,
            input.accessLevel,
            expiresAt
          );

          if (!success) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to share record",
            });
          }

          await logRecordAccess(input.recordId, ctx.user!.id, "share");

          return {
            success: true,
            message: "Record shared successfully",
          };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to share record",
          });
        }
      }),

    getSharedWithMe: protectedProcedure
      .query(async ({ ctx }) => {
        try {
          return await getSharedRecordsForUser(ctx.user!.id);
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch shared records",
          });
        }
      }),

    getSharedByMe: protectedProcedure
      .query(async ({ ctx }) => {
        try {
          return await getRecordsSharedByPatient(ctx.user!.id);
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch shared records",
          });
        }
      }),

    revokeAccess: protectedProcedure
      .input(z.object({ sharingId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        try {
          const success = await revokeRecordAccess(input.sharingId);
          if (!success) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to revoke access",
            });
          }
          return { success: true, message: "Access revoked successfully" };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to revoke access",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
