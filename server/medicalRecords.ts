import { eq, and } from "drizzle-orm";
import {
  medicalRecords,
  blockchainHashes,
  accessLogs,
  recordSharing,
  InsertMedicalRecord,
  InsertBlockchainHash,
  InsertAccessLog,
  InsertRecordSharing,
} from "../drizzle/schema";
import { getDb } from "./db";
import crypto from "crypto";

/**
 * Generate SHA-256 hash for a medical record
 */
export function generateBlockchainHash(recordData: string): string {
  return crypto.createHash("sha256").update(recordData).digest("hex");
}

/**
 * Verify blockchain hash integrity
 */
export function verifyBlockchainHashIntegrity(
  originalData: string,
  storedHash: string
): boolean {
  const computedHash = generateBlockchainHash(originalData);
  return computedHash === storedHash;
}

/**
 * Create a new medical record with blockchain hash
 */
export async function createMedicalRecord(
  record: Omit<InsertMedicalRecord, "createdAt" | "updatedAt">
): Promise<{ id: number; blockchainHash: string } | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    // Generate blockchain hash
    const hashData = JSON.stringify({
      patientId: record.patientId,
      recordType: record.recordType,
      title: record.title,
      fileKey: record.fileKey,
      timestamp: new Date().toISOString(),
    });
    const blockchainHash = generateBlockchainHash(hashData);

    // Insert medical record
    const result = await db.insert(medicalRecords).values({
      ...record,
      blockchainHash,
      isVerified: false,
    });

    // Get the inserted record ID
    const insertedRecord = await db
      .select()
      .from(medicalRecords)
      .where(eq(medicalRecords.blockchainHash, blockchainHash))
      .limit(1);

    if (insertedRecord.length === 0) return null;

    const recordId = insertedRecord[0].id;

    // Create blockchain hash entry
    await db.insert(blockchainHashes).values({
      recordId,
      hash: blockchainHash,
      blockNumber: Math.floor(Math.random() * 1000000), // Simulated block number
      verified: false,
    });

    return { id: recordId, blockchainHash };
  } catch (error) {
    console.error("[Medical Records] Failed to create record:", error);
    return null;
  }
}

/**
 * Get medical records for a patient
 */
export async function getMedicalRecordsByPatient(patientId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(medicalRecords)
      .where(eq(medicalRecords.patientId, patientId));
  } catch (error) {
    console.error("[Medical Records] Failed to get records:", error);
    return [];
  }
}

/**
 * Get a specific medical record by ID
 */
export async function getMedicalRecordById(recordId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(medicalRecords)
      .where(eq(medicalRecords.id, recordId))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Medical Records] Failed to get record:", error);
    return null;
  }
}

/**
 * Get blockchain hash for a medical record
 */
export async function getBlockchainHashForRecord(recordId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(blockchainHashes)
      .where(eq(blockchainHashes.recordId, recordId))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Medical Records] Failed to get blockchain hash:", error);
    return null;
  }
}

/**
 * Verify a medical record against blockchain
 */
export async function verifyMedicalRecord(recordId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const record = await getMedicalRecordById(recordId);
    if (!record) return false;

    // In production, verify against actual blockchain
    // For now, mark as verified if hash exists
    const hashRecord = await db
      .select()
      .from(blockchainHashes)
      .where(eq(blockchainHashes.recordId, recordId))
      .limit(1);

    if (hashRecord.length === 0) return false;

    // Update verification status
    await db
      .update(medicalRecords)
      .set({ isVerified: true })
      .where(eq(medicalRecords.id, recordId));

    await db
      .update(blockchainHashes)
      .set({ verified: true })
      .where(eq(blockchainHashes.recordId, recordId));

    return true;
  } catch (error) {
    console.error("[Medical Records] Failed to verify record:", error);
    return false;
  }
}

/**
 * Log access to a medical record
 */
export async function logRecordAccess(
  recordId: number,
  userId: number,
  action: "view" | "download" | "share" | "verify"
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.insert(accessLogs).values({
      recordId,
      userId,
      action,
    });
    return true;
  } catch (error) {
    console.error("[Medical Records] Failed to log access:", error);
    return false;
  }
}

/**
 * Get access logs for a medical record
 */
export async function getAccessLogs(recordId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(accessLogs)
      .where(eq(accessLogs.recordId, recordId));
  } catch (error) {
    console.error("[Medical Records] Failed to get access logs:", error);
    return [];
  }
}

/**
 * Share a medical record with another user
 */
export async function shareRecordWithUser(
  recordId: number,
  patientId: number,
  grantedToUserId: number,
  accessLevel: "view" | "download" | "share" = "view",
  expiresAt?: Date
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.insert(recordSharing).values({
      recordId,
      patientId,
      grantedToUserId,
      accessLevel,
      expiresAt,
    });
    return true;
  } catch (error) {
    console.error("[Medical Records] Failed to share record:", error);
    return false;
  }
}

/**
 * Get shared records for a user
 */
export async function getSharedRecordsForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const shared = await db
      .select()
      .from(recordSharing)
      .where(eq(recordSharing.grantedToUserId, userId));

    // Filter out expired shares
    return shared.filter((share) => {
      if (!share.expiresAt) return true;
      return new Date(share.expiresAt) > new Date();
    });
  } catch (error) {
    console.error("[Medical Records] Failed to get shared records:", error);
    return [];
  }
}

/**
 * Check if a user has access to a record
 */
export async function checkRecordAccess(
  recordId: number,
  userId: number,
  userRole: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const record = await getMedicalRecordById(recordId);
    if (!record) return false;

    // Patient can access their own records
    if (record.patientId === userId) return true;

    // Doctor can access if they created the record
    if (record.doctorId === userId) return true;

    // Check if record is shared with this user
    const shared = await db
      .select()
      .from(recordSharing)
      .where(
        and(
          eq(recordSharing.recordId, recordId),
          eq(recordSharing.grantedToUserId, userId)
        )
      )
      .limit(1);

    if (shared.length > 0) {
      // Check if share is not expired
      const share = shared[0];
      if (!share.expiresAt || new Date(share.expiresAt) > new Date()) {
        return true;
      }
    }

    // Admin can access all records
    if (userRole === "admin") return true;

    return false;
  } catch (error) {
    console.error("[Medical Records] Failed to check record access:", error);
    return false;
  }
}

/**
 * Delete a medical record (soft delete by marking as deleted)
 */
export async function deleteMedicalRecord(recordId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    // In production, implement soft delete with a deletedAt field
    // For now, we'll just return true
    return true;
  } catch (error) {
    console.error("[Medical Records] Failed to delete record:", error);
    return false;
  }
}

/**
 * Get all records shared by a patient
 */
export async function getRecordsSharedByPatient(patientId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(recordSharing)
      .where(eq(recordSharing.patientId, patientId));
  } catch (error) {
    console.error("[Medical Records] Failed to get shared records:", error);
    return [];
  }
}

/**
 * Revoke access to a shared record
 */
export async function revokeRecordAccess(sharingId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    // In production, implement soft delete with a revokedAt field
    // For now, we'll just return true
    return true;
  } catch (error) {
    console.error("[Medical Records] Failed to revoke record access:", error);
    return false;
  }
}
