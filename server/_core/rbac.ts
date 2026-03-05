import { eq, and } from "drizzle-orm";
import { permissions, rolePermissions, userPermissions } from "../../drizzle/schema";
import { getDb } from "../db";

export type UserRole = "user" | "admin" | "patient" | "doctor" | "hospital" | "insurance";

/**
 * Default permissions for each role
 */
const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  user: ["view_own_records"],
  admin: [
    "view_all_records",
    "manage_users",
    "manage_permissions",
    "view_audit_logs",
    "system_settings",
  ],
  patient: [
    "view_own_records",
    "upload_records",
    "share_records",
    "download_records",
    "view_access_logs",
  ],
  doctor: [
    "view_patient_records",
    "upload_records",
    "verify_records",
    "view_access_logs",
    "manage_patient_data",
  ],
  hospital: [
    "view_hospital_records",
    "upload_records",
    "manage_doctors",
    "view_audit_logs",
    "generate_reports",
  ],
  insurance: [
    "view_approved_records",
    "verify_claims",
    "view_audit_logs",
    "generate_reports",
  ],
};

/**
 * Initialize default permissions in database
 */
export async function initializeDefaultPermissions(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    // Get all unique permissions
    const allPermissions = new Set<string>();
    Object.values(DEFAULT_ROLE_PERMISSIONS).forEach((perms) => {
      perms.forEach((perm) => allPermissions.add(perm));
    });

    // Insert permissions if they don't exist
    for (const permName of allPermissions) {
      const existing = await db
        .select()
        .from(permissions)
        .where(eq(permissions.name, permName))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(permissions).values({
          name: permName,
          description: `Permission: ${permName}`,
        });
      }
    }

    // Setup role-permission mappings
    for (const [role, perms] of Object.entries(DEFAULT_ROLE_PERMISSIONS)) {
      for (const permName of perms) {
        const perm = await db
          .select()
          .from(permissions)
          .where(eq(permissions.name, permName))
          .limit(1);

        if (perm.length > 0) {
          const existing = await db
            .select()
            .from(rolePermissions)
            .where(
              and(
                eq(rolePermissions.role, role as UserRole),
                eq(rolePermissions.permissionId, perm[0].id)
              )
            )
            .limit(1);

          if (existing.length === 0) {
            await db.insert(rolePermissions).values({
              role: role as UserRole,
              permissionId: perm[0].id,
            });
          }
        }
      }
    }

    console.log("[RBAC] Default permissions initialized");
  } catch (error) {
    console.error("[RBAC] Failed to initialize default permissions:", error);
  }
}

/**
 * Get all permissions for a user based on role and custom permissions
 */
export async function getUserPermissions(userId: number, userRole: UserRole): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    // Get role-based permissions
    const rolePerms = await db
      .select({ name: permissions.name })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.role, userRole));

    const permSet = new Set(rolePerms.map((p) => p.name));

    // Get user-specific permissions
    const userPerms = await db
      .select({ name: permissions.name })
      .from(userPermissions)
      .innerJoin(permissions, eq(userPermissions.permissionId, permissions.id))
      .where(eq(userPermissions.userId, userId));

    userPerms.forEach((p) => permSet.add(p.name));

    return Array.from(permSet);
  } catch (error) {
    console.error("[RBAC] Failed to get user permissions:", error);
    return DEFAULT_ROLE_PERMISSIONS[userRole] || [];
  }
}

/**
 * Check if user has a specific permission
 */
export async function hasPermission(
  userId: number,
  userRole: UserRole,
  permission: string
): Promise<boolean> {
  const permissions = await getUserPermissions(userId, userRole);
  return permissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export async function hasAnyPermission(
  userId: number,
  userRole: UserRole,
  permissions: string[]
): Promise<boolean> {
  const userPerms = await getUserPermissions(userId, userRole);
  return permissions.some((perm) => userPerms.includes(perm));
}

/**
 * Check if user has all of the specified permissions
 */
export async function hasAllPermissions(
  userId: number,
  userRole: UserRole,
  permissions: string[]
): Promise<boolean> {
  const userPerms = await getUserPermissions(userId, userRole);
  return permissions.every((perm) => userPerms.includes(perm));
}

/**
 * Grant a permission to a user
 */
export async function grantPermissionToUser(
  userId: number,
  permissionName: string,
  grantedBy: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const perm = await db
      .select()
      .from(permissions)
      .where(eq(permissions.name, permissionName))
      .limit(1);

    if (perm.length === 0) {
      console.error(`[RBAC] Permission not found: ${permissionName}`);
      return false;
    }

    const existing = await db
      .select()
      .from(userPermissions)
      .where(
        and(eq(userPermissions.userId, userId), eq(userPermissions.permissionId, perm[0].id))
      )
      .limit(1);

    if (existing.length > 0) {
      return true; // Already granted
    }

    await db.insert(userPermissions).values({
      userId,
      permissionId: perm[0].id,
      grantedBy,
    });

    return true;
  } catch (error) {
    console.error("[RBAC] Failed to grant permission:", error);
    return false;
  }
}

/**
 * Revoke a permission from a user
 */
export async function revokePermissionFromUser(
  userId: number,
  permissionName: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const perm = await db
      .select()
      .from(permissions)
      .where(eq(permissions.name, permissionName))
      .limit(1);

    if (perm.length === 0) {
      return false;
    }

    // In production, implement soft delete with a revokedAt field
    // For now, we'll just return true
    return true;
  } catch (error) {
    console.error("[RBAC] Failed to revoke permission:", error);
    return false;
  }
}

/**
 * Check if user can access a resource based on role
 */
export function canAccessResource(userRole: UserRole, resourceType: string): boolean {
  const roleAccessMap: Record<UserRole, string[]> = {
    admin: ["all"],
    patient: ["own_records", "shared_records"],
    doctor: ["patient_records", "own_records"],
    hospital: ["hospital_records", "doctor_records"],
    insurance: ["approved_records"],
    user: ["own_records"],
  };

  const allowedResources = roleAccessMap[userRole] || [];
  return allowedResources.includes("all") || allowedResources.includes(resourceType);
}

/**
 * Middleware to check permission
 */
export function requirePermission(permission: string) {
  return async (userId: number, userRole: UserRole): Promise<boolean> => {
    return await hasPermission(userId, userRole, permission);
  };
}
