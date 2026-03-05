import { Shield, Mail, Github, CheckCircle, AlertCircle, Code } from "lucide-react";
import { useLocation } from "wouter";
import Footer from "@/components/layout/Footer";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";

export default function OAuthDemoPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between py-4">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-primary">MediVault</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-grow">
        {/* Page Header */}
        <section className="mb-16">
          <h1 className="text-5xl font-serif font-bold mb-4">OAuth 2.0 Authentication Demo</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            MediVault now supports secure social authentication using Google and GitHub OAuth 2.0.
          </p>
        </section>

        {/* Demo Section */}
        <section className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Demo */}
          <div>
            <h2 className="text-3xl font-serif font-bold mb-8">Try It Now</h2>
            <div className="card-elevated p-8 space-y-6">
              <p className="text-muted-foreground">
                Click one of the buttons below to test the OAuth authentication flow:
              </p>
              <SocialLoginButtons />
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> You'll be redirected to Google or GitHub to authenticate, then back to MediVault.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Features */}
          <div>
            <h2 className="text-3xl font-serif font-bold mb-8">Features</h2>
            <div className="space-y-4">
              <div className="card-elevated p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Secure OAuth 2.0</h4>
                    <p className="text-sm text-muted-foreground">Industry-standard OAuth 2.0 implementation with CSRF protection</p>
                  </div>
                </div>
              </div>

              <div className="card-elevated p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Google Login</h4>
                    <p className="text-sm text-muted-foreground">Sign in with your Google account securely</p>
                  </div>
                </div>
              </div>

              <div className="card-elevated p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">GitHub Login</h4>
                    <p className="text-sm text-muted-foreground">Sign in with your GitHub account securely</p>
                  </div>
                </div>
              </div>

              <div className="card-elevated p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Automatic User Creation</h4>
                    <p className="text-sm text-muted-foreground">Users are automatically created on first login</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Details */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold mb-8">Implementation Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Google OAuth */}
            <div className="card-elevated p-8 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-serif font-bold">Google OAuth</h3>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground mb-1">Authorization URL:</p>
                  <code className="bg-muted p-2 rounded text-xs block break-all">
                    https://accounts.google.com/o/oauth2/v2/auth
                  </code>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Token Exchange:</p>
                  <code className="bg-muted p-2 rounded text-xs block break-all">
                    https://oauth2.googleapis.com/token
                  </code>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">User Info:</p>
                  <code className="bg-muted p-2 rounded text-xs block break-all">
                    https://www.googleapis.com/oauth2/v2/userinfo
                  </code>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Scopes:</p>
                  <code className="bg-muted p-2 rounded text-xs">openid profile email</code>
                </div>
              </div>
            </div>

            {/* GitHub OAuth */}
            <div className="card-elevated p-8 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Github className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-serif font-bold">GitHub OAuth</h3>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground mb-1">Authorization URL:</p>
                  <code className="bg-muted p-2 rounded text-xs block break-all">
                    https://github.com/login/oauth/authorize
                  </code>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Token Exchange:</p>
                  <code className="bg-muted p-2 rounded text-xs block break-all">
                    https://github.com/login/oauth/access_token
                  </code>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">User Info:</p>
                  <code className="bg-muted p-2 rounded text-xs block break-all">
                    https://api.github.com/user
                  </code>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Scopes:</p>
                  <code className="bg-muted p-2 rounded text-xs">user:email</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Backend Endpoints */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold mb-8">Backend Endpoints</h2>
          <div className="card-elevated p-8 space-y-6">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Code className="w-5 h-5" />
                Google OAuth Endpoints
              </h4>
              <div className="space-y-2 text-sm">
                <div className="bg-muted p-3 rounded">
                  <p className="font-mono text-xs">GET /api/oauth/google/login</p>
                  <p className="text-muted-foreground text-xs mt-1">Initiates Google OAuth flow</p>
                </div>
                <div className="bg-muted p-3 rounded">
                  <p className="font-mono text-xs">GET /api/oauth/google/callback</p>
                  <p className="text-muted-foreground text-xs mt-1">Handles Google OAuth callback</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Code className="w-5 h-5" />
                GitHub OAuth Endpoints
              </h4>
              <div className="space-y-2 text-sm">
                <div className="bg-muted p-3 rounded">
                  <p className="font-mono text-xs">GET /api/oauth/github/login</p>
                  <p className="text-muted-foreground text-xs mt-1">Initiates GitHub OAuth flow</p>
                </div>
                <div className="bg-muted p-3 rounded">
                  <p className="font-mono text-xs">GET /api/oauth/github/callback</p>
                  <p className="text-muted-foreground text-xs mt-1">Handles GitHub OAuth callback</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold mb-8">Security Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-elevated p-6 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">CSRF Protection</h4>
                  <p className="text-sm text-muted-foreground">State parameter validation prevents CSRF attacks</p>
                </div>
              </div>
            </div>

            <div className="card-elevated p-6 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Secure Cookies</h4>
                  <p className="text-sm text-muted-foreground">HttpOnly cookies prevent XSS attacks</p>
                </div>
              </div>
            </div>

            <div className="card-elevated p-6 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">HTTPS Required</h4>
                  <p className="text-sm text-muted-foreground">All OAuth flows use secure HTTPS connections</p>
                </div>
              </div>
            </div>

            <div className="card-elevated p-6 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Token Validation</h4>
                  <p className="text-sm text-muted-foreground">All tokens are validated before use</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Configuration */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12 border border-border">
          <h2 className="text-3xl font-serif font-bold mb-6">Environment Configuration</h2>
          <p className="text-muted-foreground mb-6">
            The following environment variables are required for OAuth authentication:
          </p>
          <div className="space-y-3 text-sm">
            <div className="bg-background p-3 rounded font-mono">
              GOOGLE_CLIENT_ID=your_google_client_id
            </div>
            <div className="bg-background p-3 rounded font-mono">
              GOOGLE_CLIENT_SECRET=your_google_client_secret
            </div>
            <div className="bg-background p-3 rounded font-mono">
              GITHUB_CLIENT_ID=your_github_client_id
            </div>
            <div className="bg-background p-3 rounded font-mono">
              GITHUB_CLIENT_SECRET=your_github_client_secret
            </div>
            <div className="bg-background p-3 rounded font-mono">
              APP_URL=http://localhost:5173 (or your production URL)
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
