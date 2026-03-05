import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, longtext, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "patient", "doctor", "hospital", "insurance"]).default("user").notNull(),
  // OAuth provider information
  googleId: varchar("googleId", { length: 255 }).unique(),
  githubId: varchar("githubId", { length: 255 }).unique(),
  // User profile information
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  dateOfBirth: varchar("dateOfBirth", { length: 10 }),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  address: text("address"),
  // Permissions tracking
  permissions: text("permissions"), // JSON array of permission names
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Medical records table for storing patient medical documents
 */
export const medicalRecords = mysqlTable("medical_records", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  doctorId: int("doctorId"),
  recordType: varchar("recordType", { length: 100 }).notNull(), // e.g., "Lab Report", "Prescription", "X-Ray"
  title: varchar("title", { length: 255 }).notNull(),
  description: longtext("description"),
  fileUrl: varchar("fileUrl", { length: 500 }),
  fileKey: varchar("fileKey", { length: 500 }), // S3 key
  blockchainHash: varchar("blockchainHash", { length: 255 }), // SHA-256 hash
  blockchainBlock: int("blockchainBlock"), // Block number for verification
  isVerified: boolean("isVerified").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertMedicalRecord = typeof medicalRecords.$inferInsert;

/**
 * Blockchain verification records
 */
export const blockchainHashes = mysqlTable("blockchain_hashes", {
  id: int("id").autoincrement().primaryKey(),
  recordId: int("recordId").notNull(),
  hash: varchar("hash", { length: 255 }).notNull(),
  blockNumber: int("blockNumber").notNull(),
  transactionHash: varchar("transactionHash", { length: 255 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  verified: boolean("verified").default(false).notNull(),
});

export type BlockchainHash = typeof blockchainHashes.$inferSelect;
export type InsertBlockchainHash = typeof blockchainHashes.$inferInsert;

/**
 * Access logs for audit trail
 */
export const accessLogs = mysqlTable("access_logs", {
  id: int("id").autoincrement().primaryKey(),
  recordId: int("recordId").notNull(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 50 }).notNull(), // "view", "download", "share", "verify"
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type AccessLog = typeof accessLogs.$inferSelect;
export type InsertAccessLog = typeof accessLogs.$inferInsert;

/**
 * Permissions table for role-based access control
 */
export const permissions = mysqlTable("permissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
});

export type Permission = typeof permissions.$inferSelect;
export type InsertPermission = typeof permissions.$inferInsert;

/**
 * Role-permission mapping
 */
export const rolePermissions = mysqlTable("role_permissions", {
  id: int("id").autoincrement().primaryKey(),
  role: mysqlEnum("role", ["user", "admin", "patient", "doctor", "hospital", "insurance"]).notNull(),
  permissionId: int("permissionId").notNull(),
});

export type RolePermission = typeof rolePermissions.$inferSelect;
export type InsertRolePermission = typeof rolePermissions.$inferInsert;

/**
 * User-specific permissions (overrides role permissions)
 */
export const userPermissions = mysqlTable("user_permissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  permissionId: int("permissionId").notNull(),
  grantedAt: timestamp("grantedAt").defaultNow().notNull(),
  grantedBy: int("grantedBy"), // Admin who granted this permission
});

export type UserPermission = typeof userPermissions.$inferSelect;
export type InsertUserPermission = typeof userPermissions.$inferInsert;

/**
 * Record sharing permissions (for patient to grant access to doctors)
 */
export const recordSharing = mysqlTable("record_sharing", {
  id: int("id").autoincrement().primaryKey(),
  recordId: int("recordId").notNull(),
  patientId: int("patientId").notNull(),
  grantedToUserId: int("grantedToUserId").notNull(),
  accessLevel: mysqlEnum("accessLevel", ["view", "download", "share"]).default("view").notNull(),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RecordSharing = typeof recordSharing.$inferSelect;
export type InsertRecordSharing = typeof recordSharing.$inferInsert;
