# OAuth 2.0 Authentication Setup Guide for MediVault

This guide provides step-by-step instructions for setting up Google and GitHub OAuth 2.0 authentication in MediVault.

## Table of Contents

1. [Google OAuth Setup](#google-oauth-setup)
2. [GitHub OAuth Setup](#github-oauth-setup)
3. [Environment Configuration](#environment-configuration)
4. [Testing the OAuth Flow](#testing-the-oauth-flow)
5. [Security Best Practices](#security-best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter a project name (e.g., "MediVault OAuth")
5. Click "CREATE"

### Step 2: Enable Google+ API

1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click on it and press "ENABLE"

### Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click "CREATE CREDENTIALS" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Select "External" user type
   - Fill in the required fields:
     - App name: "MediVault"
     - User support email: your-email@example.com
     - Developer contact: your-email@example.com
   - Add scopes: `openid`, `profile`, `email`
   - Add test users if in development
4. After configuring consent screen, create the OAuth client ID:
   - Application type: "Web application"
   - Name: "MediVault Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:5173` (development)
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:5173/api/oauth/google/callback` (development)
     - `http://localhost:3000/api/oauth/google/callback` (development)
     - `https://yourdomain.com/api/oauth/google/callback` (production)
5. Click "CREATE"
6. Copy your **Client ID** and **Client Secret**

---

## GitHub OAuth Setup

### Step 1: Register OAuth Application

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: MediVault
   - **Homepage URL**: `http://localhost:5173` (development) or `https://yourdomain.com` (production)
   - **Authorization callback URL**: `http://localhost:5173/api/oauth/github/callback` (development) or `https://yourdomain.com/api/oauth/github/callback` (production)
4. Click "Register application"
5. You'll see your **Client ID**
6. Click "Generate a new client secret"
7. Copy your **Client ID** and **Client Secret**

---

## Environment Configuration

### Step 1: Create .env File

Create a `.env` file in the root directory of your MediVault project:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Application URL
APP_URL=http://localhost:5173

# Other existing environment variables
DATABASE_URL=mysql://user:password@localhost:3306/medivault
JWT_SECRET=your_jwt_secret_here
```

### Step 2: Update .env for Production

For production deployment, update the environment variables:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_production_github_client_id
GITHUB_CLIENT_SECRET=your_production_github_client_secret

# Application URL
APP_URL=https://yourdomain.com

# Other production variables
DATABASE_URL=mysql://prod_user:prod_password@prod_host:3306/medivault
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
```

---

## Testing the OAuth Flow

### Step 1: Start the Development Server

```bash
npm install
npm run dev
```

### Step 2: Access the OAuth Demo Page

1. Open your browser and navigate to `http://localhost:5173/oauth-demo`
2. You'll see the OAuth Demo page with:
   - "Continue with Google" button
   - "Continue with GitHub" button
   - Implementation details
   - Security features

### Step 3: Test Google Login

1. Click "Continue with Google"
2. You'll be redirected to Google's login page
3. Sign in with your Google account
4. Authorize the application
5. You'll be redirected back to MediVault and logged in

### Step 4: Test GitHub Login

1. Click "Continue with GitHub"
2. You'll be redirected to GitHub's login page
3. Sign in with your GitHub account
4. Authorize the application
5. You'll be redirected back to MediVault and logged in

### Step 5: Test from Login Page

1. Navigate to `http://localhost:5173/login`
2. You'll see the social login buttons at the top of the login form
3. Click either button to test the OAuth flow

---

## Security Best Practices

### 1. CSRF Protection

- **State Parameter**: The OAuth implementation uses a state parameter to prevent CSRF attacks
- **Validation**: The state is validated on the callback to ensure it matches the original request
- **Storage**: The state is stored in an httpOnly cookie for security

### 2. Secure Cookies

- **HttpOnly**: Cookies are set with the HttpOnly flag to prevent XSS attacks
- **Secure Flag**: In production, cookies are set with the Secure flag (HTTPS only)
- **SameSite**: Cookies use SameSite=Lax to prevent CSRF attacks

### 3. Token Validation

- **Access Token**: Validated before use to ensure it's still valid
- **ID Token**: Verified to ensure it comes from the correct provider
- **Expiration**: Tokens are checked for expiration

### 4. HTTPS in Production

- **Required**: Always use HTTPS in production
- **Redirect URIs**: Must use HTTPS in production OAuth configurations
- **Cookies**: Secure flag is automatically set for HTTPS connections

### 5. Environment Variables

- **Never Commit Secrets**: Never commit `.env` files to version control
- **Use .gitignore**: Add `.env` to `.gitignore`
- **Rotate Secrets**: Regularly rotate your OAuth secrets
- **Access Control**: Limit access to environment variables in production

---

## Troubleshooting

### Issue: "Invalid Client ID"

**Solution**: 
- Verify your `GOOGLE_CLIENT_ID` or `GITHUB_CLIENT_ID` is correct
- Check that the credentials are for the correct environment (development vs. production)
- Ensure the credentials are not expired

### Issue: "Redirect URI Mismatch"

**Solution**:
- Verify the redirect URI in your OAuth app configuration matches exactly:
  - `http://localhost:5173/api/oauth/google/callback` (Google)
  - `http://localhost:5173/api/oauth/github/callback` (GitHub)
- Check for trailing slashes or protocol mismatches (http vs. https)

### Issue: "Invalid State Parameter"

**Solution**:
- Clear browser cookies and try again
- Ensure cookies are enabled in your browser
- Check that the state parameter is being stored correctly in cookies

### Issue: "User Info Not Retrieved"

**Solution**:
- Verify that the access token is valid
- Check that the scopes include `profile` and `email` for Google
- Check that the scopes include `user:email` for GitHub
- Ensure the API endpoints are accessible

### Issue: "Database Error on Login"

**Solution**:
- Verify `DATABASE_URL` is correct and the database is running
- Check that the `users` table exists with the correct schema
- Ensure the database user has proper permissions

### Issue: "Session Not Persisting"

**Solution**:
- Verify `JWT_SECRET` is set and consistent
- Check that cookies are being set correctly (check browser DevTools)
- Ensure the cookie options are correct for your environment

---

## API Endpoints

### Google OAuth Endpoints

- **Login Initiation**: `GET /api/oauth/google/login`
- **Callback**: `GET /api/oauth/google/callback`

### GitHub OAuth Endpoints

- **Login Initiation**: `GET /api/oauth/github/login`
- **Callback**: `GET /api/oauth/github/callback`

---

## Frontend Components

### SocialLoginButtons Component

Located at: `client/src/components/auth/SocialLoginButtons.tsx`

Usage:
```tsx
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";

export default function LoginPage() {
  return (
    <div>
      <SocialLoginButtons disabled={false} />
    </div>
  );
}
```

### OAuth Demo Page

Located at: `client/src/pages/OAuthDemoPage.tsx`

Access at: `http://localhost:5173/oauth-demo`

---

## Backend Implementation

### OAuth Routes

Located at: `server/_core/oauth.ts`

Implements:
- Google OAuth login and callback
- GitHub OAuth login and callback
- State parameter generation and validation
- User creation/update on successful authentication

### OAuth Providers

Located at: `server/_core/socialOAuth.ts`

Implements:
- Google OAuth configuration and utilities
- GitHub OAuth configuration and utilities
- Token exchange logic
- User info retrieval

### Environment Configuration

Located at: `server/_core/env.ts`

Loads OAuth credentials from environment variables:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

---

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [OAuth 2.0 Security Best Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics)

---

## Support

For issues or questions about the OAuth implementation, please refer to the troubleshooting section above or check the MediVault GitHub repository for additional support.
