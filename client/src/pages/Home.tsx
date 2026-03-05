import { Button } from "@/components/ui/button";
import React from "react";
import { useLocation } from "wouter";
import { Shield, Lock, FileCheck, Zap, Users, TrendingUp } from "lucide-react";
import Footer from "@/components/layout/Footer";

/**
 * MediVault Home Page - Landing Page
 * Design: Modern Healthcare Minimalism with green/cream palette
 * - Hero section with value proposition
 * - Feature highlights
 * - Call-to-action buttons
 * - Footer with navigation
 */
export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-primary">MediVault</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/features" className="text-foreground hover:text-primary transition-colors">Features</a>
            <a href="/security" className="text-foreground hover:text-primary transition-colors">Security</a>
            <a href="/about" className="text-foreground hover:text-primary transition-colors">About</a>
            <a href="/oauth-demo" className="text-foreground hover:text-primary transition-colors">OAuth Demo</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="border-primary text-primary hover:bg-primary/5"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate("/login")}
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container py-20 md:py-32">
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-foreground">
              Secure Medical Records, Powered by Blockchain
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              MediVault empowers patients and healthcare providers with a secure, transparent platform for managing medical records. Your health data, your control.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button 
                onClick={() => navigate("/login")}
                className="bg-primary text-primary-foreground hover:opacity-90 px-8 py-3 text-lg"
              >
                Get Started Free
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/features")}
                className="border-border hover:bg-muted px-8 py-3 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-card border-y border-border py-20">
          <div className="container">
            <h3 className="text-4xl font-serif font-bold mb-12 text-center">Why Choose MediVault?</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-serif font-bold">Military-Grade Security</h4>
                <p className="text-muted-foreground">
                  AES-256 encryption protects your medical records with the same security used by governments and financial institutions.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-serif font-bold">Blockchain Verified</h4>
                <p className="text-muted-foreground">
                  Records are verified and stored on blockchain, providing immutable proof of authenticity and integrity.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-serif font-bold">Easy Sharing</h4>
                <p className="text-muted-foreground">
                  Share your medical records with healthcare providers securely with granular permission controls.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="container py-20">
          <h3 className="text-4xl font-serif font-bold mb-12 text-center">Enterprise-Grade Security</h3>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">HIPAA Compliant</h4>
                  <p className="text-sm text-muted-foreground">
                    Full compliance with HIPAA, GDPR, and other healthcare regulations.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Zero-Knowledge Architecture</h4>
                  <p className="text-sm text-muted-foreground">
                    We cannot access your data. Only you hold the encryption keys.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">24/7 Monitoring</h4>
                  <p className="text-sm text-muted-foreground">
                    Real-time security monitoring and threat detection systems.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-border">
              <h4 className="text-2xl font-serif font-bold mb-6">Certifications</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>ISO 27001</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>SOC 2 Type II</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>HIPAA</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>GDPR</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>CCPA</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-y border-border py-20">
          <div className="container text-center">
            <h3 className="text-4xl font-serif font-bold mb-4">Ready to Secure Your Medical Records?</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of healthcare professionals and patients using MediVault to manage their medical records securely.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                onClick={() => navigate("/login")}
                className="bg-primary text-primary-foreground hover:opacity-90 px-8 py-3 text-lg"
              >
                Get Started
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/pricing")}
                className="border-border hover:bg-muted px-8 py-3 text-lg"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
