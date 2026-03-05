# MediVault Implementation Guide

This document provides a comprehensive guide to the new features implemented in MediVault, including SMS OTP delivery, medical record management with blockchain verification, role-based access control, and OAuth authentication.

## Table of Contents

1. [SMS OTP Integration](#sms-otp-integration)
2. [Medical Record Management](#medical-record-management)
3. [Role-Based Access Control](#role-based-access-control)
4. [OAuth Authentication](#oauth-authentication)
5. [Database Schema](#database-schema)
6. [Environment Variables](#environment-variables)
7. [API Endpoints](#api-endpoints)

---

## SMS OTP Integration

### Overview

The SMS OTP integration uses **Twilio** to send one-time passwords (OTPs) to users for authentication. The system falls back to console logging in development mode when Twilio credentials are not configured.

### Configuration

**File:** `server/_core/sms.ts`

#### Environment Variables Required

```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio phone number
```

#### Key Functions

- **`sendOTPViaSMS(phoneNumber, otp)`** - Sends OTP via SMS
- **`sendSMS(phoneNumber, message)`** - Generic SMS sending function
- **`sendVerificationCodeViaSMS(phoneNumber, code)`** - Sends verification code
- **`sendNotificationViaSMS(phoneNumber, notification)`** - Sends notifications

#### Usage Example

```typescript
import { sendOTPViaSMS } from "./server/_core/sms";

const success = await sendOTPViaSMS("+1234567890", "123456");
if (success) {
  console.log("OTP sent successfully");
}
```

#### Development Mode

When Twilio credentials are not configured, the system logs OTPs to the console:

```
[SMS] (Development Mode) Sending SMS to +1234567890: Your MediVault OTP is: 123456...
```

---

## Medical Record Management

### Overview

Medical records are stored with blockchain hash verification, access logging, and sharing capabilities. Each record is assigned a SHA-256 hash for integrity verification.

### Database Tables

#### `medical_records`

Stores patient medical documents with metadata.

```sql
CREATE TABLE medical_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patientId INT NOT NULL,
  doctorId INT,
  recordType VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  fileUrl VARCHAR(500),
  fileKey VARCHAR(500),
  blockchainHash VARCHAR(255),
  blockchainBlock INT,
  isVerified BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### `blockchain_hashes`

Stores blockchain verification information.

```sql
CREATE TABLE blockchain_hashes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  recordId INT NOT NULL,
  hash VARCHAR(255) NOT NULL,
  blockNumber INT NOT NULL,
  transactionHash VARCHAR(255),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE
);
```

#### `access_logs`

Audit trail for record access.

```sql
CREATE TABLE access_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  recordId INT NOT NULL,
  userId INT NOT NULL,
  action VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `record_sharing`

Tracks record sharing permissions between users.

```sql
CREATE TABLE record_sharing (
  id INT PRIMARY KEY AUTO_INCREMENT,
  recordId INT NOT NULL,
  patientId INT NOT NULL,
  grantedToUserId INT NOT NULL,
  accessLevel ENUM('view', 'download', 'share') DEFAULT 'view',
  expiresAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Key Functions

**File:** `server/medicalRecords.ts`

- **`createMedicalRecord(record)`** - Creates a new medical record with blockchain hash
- **`getMedicalRecordsByPatient(patientId)`** - Retrieves all records for a patient
- **`getMedicalRecordById(recordId)`** - Retrieves a specific record
- **`verifyMedicalRecord(recordId)`** - Verifies record integrity
- **`logRecordAccess(recordId, userId, action)`** - Logs access to a record
- **`shareRecordWithUser(recordId, patientId, grantedToUserId, accessLevel, expiresAt)`** - Shares record with another user
- **`checkRecordAccess(recordId, userId, userRole)`** - Checks if user has access to record
- **`generateBlockchainHash(recordData)`** - Generates SHA-256 hash for record

### tRPC Procedures

**File:** `server/routers.ts`

#### Upload Record

```typescript
medicalRecords.upload({
  patientId: 1,
  recordType: "Lab Report",
  title: "Blood Test Results",
  description: "Annual blood work",
  fileUrl: "https://s3.example.com/record.pdf",
  fileKey: "records/patient-1/blood-test.pdf"
})
```

#### Get Records

```typescript
medicalRecords.list({ patientId: 1 })
medicalRecords.get({ recordId: 1 })
```

#### Verify Record

```typescript
medicalRecords.verify({ recordId: 1 })
```

#### Get Blockchain Hash

```typescript
medicalRecords.getBlockchainHash({ recordId: 1 })
```

#### Share Record

```typescript
medicalRecords.share({
  recordId: 1,
  grantedToUserId: 5,
  accessLevel: "view",
  expiresInDays: 30
})
```

#### Get Shared Records

```typescript
medicalRecords.getSharedWithMe()  // Records shared with current user
medicalRecords.getSharedByMe()    // Records shared by current user
```

#### Revoke Access

```typescript
medicalRecords.revokeAccess({ sharingId: 1 })
```

#### Access Logs

```typescript
medicalRecords.accessLogs({ recordId: 1 })
```

---

## Role-Based Access Control

### Overview

MediVault implements a comprehensive RBAC system with role-based and user-specific permissions. The system supports multiple user roles with different access levels.

### User Roles

| Role | Description | Default Permissions |
|------|-------------|-------------------|
| `admin` | System administrator | All permissions |
| `patient` | Patient user | View own records, upload, share, download |
| `doctor` | Medical professional | View patient records, upload, verify, manage data |
| `hospital` | Hospital administrator | View hospital records, manage doctors, generate reports |
| `insurance` | Insurance company | View approved records, verify claims |
| `user` | Regular user | View own records |

### Database Tables

#### `permissions`

Stores available permissions in the system.

```sql
CREATE TABLE permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);
```

#### `role_permissions`

Maps roles to permissions.

```sql
CREATE TABLE role_permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role ENUM('user', 'admin', 'patient', 'doctor', 'hospital', 'insurance') NOT NULL,
  permissionId INT NOT NULL
);
```

#### `user_permissions`

Stores user-specific permission overrides.

```sql
CREATE TABLE user_permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  permissionId INT NOT NULL,
  grantedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  grantedBy INT
);
```

### Key Functions

**File:** `server/_core/rbac.ts`

- **`initializeDefaultPermissions()`** - Initialize default role-permission mappings
- **`getUserPermissions(userId, userRole)`** - Get all permissions for a user
- **`hasPermission(userId, userRole, permission)`** - Check if user has specific permission
- **`hasAnyPermission(userId, userRole, permissions)`** - Check if user has any of the permissions
- **`hasAllPermissions(userId, userRole, permissions)`** - Check if user has all permissions
- **`grantPermissionToUser(userId, permissionName, grantedBy)`** - Grant permission to user
- **`revokePermissionFromUser(userId, permissionName)`** - Revoke permission from user
- **`canAccessResource(userRole, resourceType)`** - Check if role can access resource

### tRPC Procedures

**File:** `server/adminRouter.ts`

#### Initialize RBAC

```typescript
admin.initializeRBAC()
```

#### User Management

```typescript
admin.getAllUsers()
admin.getUser({ userId: 1 })
admin.updateUserRole({ userId: 1, role: "doctor" })
admin.deactivateUser({ userId: 1 })
admin.activateUser({ userId: 1 })
admin.getUsersByRole({ role: "patient" })
```

#### Permission Management

```typescript
admin.grantPermission({ userId: 1, permission: "view_all_records" })
admin.revokePermission({ userId: 1, permission: "view_all_records" })
```

### Middleware

**File:** `server/_core/trpc.ts`

```typescript
// Role-based procedure
const patientOnlyProcedure = roleProcedure(["patient"]);

// Permission-based procedure
const viewRecordsProcedure = permissionProcedure("view_patient_records");
```

---

## OAuth Authentication

### Overview

MediVault supports authentication via Google and GitHub OAuth providers, in addition to traditional login methods.

### Supported Providers

1. **Google OAuth** - Using Google's OAuth 2.0 service
2. **GitHub OAuth** - Using GitHub's OAuth application

### Configuration

#### Environment Variables

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
APP_URL=http://localhost:5173  # Your application URL
```

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new OAuth 2.0 Client ID
3. Add authorized redirect URI: `http://localhost:5173/api/oauth/google/callback`
4. Copy Client ID and Client Secret

#### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:5173/api/oauth/github/callback`
4. Copy Client ID and Client Secret

### API Endpoints

#### Google OAuth

- **Login Initiation:** `GET /api/oauth/google/login`
- **Callback:** `GET /api/oauth/google/callback?code=...&state=...`

#### GitHub OAuth

- **Login Initiation:** `GET /api/oauth/github/login`
- **Callback:** `GET /api/oauth/github/callback?code=...&state=...`

### Key Functions

**File:** `server/_core/socialOAuth.ts`

#### Google OAuth

```typescript
googleOAuth.getAuthorizationUrl(state)      // Get authorization URL
googleOAuth.exchangeCodeForToken(code)      // Exchange code for tokens
googleOAuth.getUserInfo(accessToken)        // Get user information
```

#### GitHub OAuth

```typescript
githubOAuth.getAuthorizationUrl(state)      // Get authorization URL
githubOAuth.exchangeCodeForToken(code)      // Exchange code for token
githubOAuth.getUserInfo(accessToken)        // Get user information
```

#### Utilities

```typescript
generateOAuthState()                        // Generate CSRF protection token
validateOAuthState(state, storedState)      // Validate state token
```

### Client-Side Integration

**File:** `client/src/lib/oauth.ts`

```typescript
import { initiateOAuthLogin } from "@/lib/oauth";

// Initiate Google login
initiateOAuthLogin("google");

// Initiate GitHub login
initiateOAuthLogin("github");
```

---

## Database Schema

### Extended Users Table

The `users` table has been extended with additional fields for OAuth and profile information:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin', 'patient', 'doctor', 'hospital', 'insurance') DEFAULT 'user',
  googleId VARCHAR(255) UNIQUE,
  githubId VARCHAR(255) UNIQUE,
  phoneNumber VARCHAR(20),
  dateOfBirth VARCHAR(10),
  gender ENUM('male', 'female', 'other'),
  address TEXT,
  permissions TEXT,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Environment Variables

### Complete Environment Configuration

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/medivault

# OAuth
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://oauth.example.com
OWNER_OPEN_ID=owner_open_id

# Twilio SMS
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Application
APP_URL=http://localhost:5173
NODE_ENV=development
JWT_SECRET=your_jwt_secret
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/oauth/google/login` | Initiate Google login |
| GET | `/api/oauth/google/callback` | Google OAuth callback |
| GET | `/api/oauth/github/login` | Initiate GitHub login |
| GET | `/api/oauth/github/callback` | GitHub OAuth callback |

### Medical Records (tRPC)

| Procedure | Type | Description |
|-----------|------|-------------|
| `medicalRecords.upload` | Mutation | Upload a new medical record |
| `medicalRecords.list` | Query | Get records for a patient |
| `medicalRecords.get` | Query | Get a specific record |
| `medicalRecords.verify` | Mutation | Verify record integrity |
| `medicalRecords.getBlockchainHash` | Query | Get blockchain hash |
| `medicalRecords.share` | Mutation | Share record with user |
| `medicalRecords.getSharedWithMe` | Query | Get records shared with user |
| `medicalRecords.getSharedByMe` | Query | Get records shared by user |
| `medicalRecords.revokeAccess` | Mutation | Revoke record access |
| `medicalRecords.accessLogs` | Query | Get access logs |

### Admin (tRPC)

| Procedure | Type | Description |
|-----------|------|-------------|
| `admin.initializeRBAC` | Mutation | Initialize RBAC system |
| `admin.getAllUsers` | Query | Get all users |
| `admin.getUser` | Query | Get specific user |
| `admin.updateUserRole` | Mutation | Update user role |
| `admin.deactivateUser` | Mutation | Deactivate user |
| `admin.activateUser` | Mutation | Activate user |
| `admin.grantPermission` | Mutation | Grant permission to user |
| `admin.revokePermission` | Mutation | Revoke permission from user |
| `admin.getUsersByRole` | Query | Get users by role |

---

## Testing

### SMS OTP Testing

In development mode without Twilio credentials, OTPs are logged to console:

```bash
npm run dev
# Check console for: [SMS] (Development Mode) Sending SMS to +1234567890: Your MediVault OTP is: 123456...
```

### Medical Records Testing

```typescript
// Test record creation
const result = await trpc.medicalRecords.upload.mutate({
  patientId: 1,
  recordType: "Lab Report",
  title: "Test Record",
  fileUrl: "https://example.com/file.pdf",
  fileKey: "test-key"
});

// Test record retrieval
const records = await trpc.medicalRecords.list.query({ patientId: 1 });

// Test record verification
const verified = await trpc.medicalRecords.verify.mutate({ recordId: result.recordId });
```

### RBAC Testing

```typescript
// Initialize RBAC
await trpc.admin.initializeRBAC.mutate();

// Check permissions
const hasPermission = await hasPermission(userId, "patient", "view_own_records");
```

---

## Security Considerations

1. **OTP Expiration:** OTPs expire after 10 minutes
2. **CSRF Protection:** OAuth state tokens prevent CSRF attacks
3. **Access Control:** All medical records require authentication
4. **Audit Trail:** All record access is logged
5. **Role-Based Access:** Permissions are enforced at the API level
6. **HTTPS:** Use HTTPS in production for OAuth and sensitive data
7. **Secrets:** Store all credentials in environment variables, never in code

---

## Troubleshooting

### Twilio SMS Not Sending

1. Verify credentials in `.env` file
2. Check Twilio account balance
3. Ensure phone number is in correct format (e.g., +1234567890)
4. Check console logs for error messages

### OAuth Login Failing

1. Verify OAuth credentials in `.env` file
2. Check redirect URI matches OAuth provider settings
3. Ensure cookies are enabled in browser
4. Check browser console for error messages

### Medical Records Not Saving

1. Verify database connection
2. Check database has required tables
3. Run migrations: `npm run db:push`
4. Check user has appropriate permissions

---

## Support

For issues or questions, please refer to the project documentation or open an issue on GitHub.
