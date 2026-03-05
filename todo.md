# MediVault TODO

## Authentication & OAuth
- [ ] Integrate Twilio SMS provider for OTP delivery
- [ ] Add Google OAuth login
- [ ] Add GitHub OAuth login
- [ ] Update LoginPage to include OAuth buttons

## Medical Record Management
- [ ] Create medical_records table in database schema
- [ ] Create blockchain_hashes table for verification
- [ ] Implement uploadMedicalRecord procedure
- [ ] Implement getMedicalRecords procedure
- [ ] Implement verifyMedicalRecord procedure
- [ ] Create medical record upload UI integration

## Role-Based Access Control (RBAC)
- [ ] Extend users table with role field (already exists)
- [ ] Create permissions table
- [ ] Create role_permissions table
- [ ] Implement adminProcedure helper
- [ ] Implement doctorProcedure helper
- [ ] Add authorization checks to medical record procedures

## Testing
- [ ] Write tests for medical record procedures
- [ ] Write tests for RBAC procedures
- [ ] Write tests for OAuth procedures

## Documentation
- [ ] Add SMS provider setup instructions
- [ ] Add OAuth setup instructions
- [ ] Add medical record API documentation
