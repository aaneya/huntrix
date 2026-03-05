import { Shield, Lock, Eye, Zap, Award, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import Footer from "@/components/layout/Footer";

export default function SecurityPage() {
  const [, navigate] = useLocation();

  const securityFeatures = [
    {
      icon: Lock,
      title: "AES-256 Encryption",
      description: "Military-grade encryption for all data at rest and in transit."
    },
    {
      icon: Shield,
      title: "Blockchain Verification",
      description: "Immutable records stored on blockchain for tamper-proof verification."
    },
    {
      icon: Eye,
      title: "Zero-Knowledge Architecture",
      description: "We cannot access your data. Only you hold the encryption keys."
    },
    {
      icon: Award,
      title: "HIPAA Compliant",
      description: "Full compliance with HIPAA, GDPR, and other healthcare regulations."
    },
    {
      icon: Zap,
      title: "Real-Time Monitoring",
      description: "24/7 security monitoring and threat detection systems."
    },
    {
      icon: AlertCircle,
      title: "Incident Response",
      description: "Rapid response team ready to handle any security incidents."
    }
  ];

  const certifications = [
    "ISO 27001",
    "SOC 2 Type II",
    "HIPAA",
    "GDPR",
    "CCPA",
    "HITECH Act"
  ];

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
          <h1 className="text-5xl font-serif font-bold mb-4">Security & Privacy</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Your medical records are your most sensitive data. We protect them with industry-leading security measures.
          </p>
        </section>

        {/* Security Features */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {securityFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="card-elevated p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Certifications */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold mb-8">Certifications & Compliance</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {certifications.map((cert, idx) => (
              <div key={idx} className="card-elevated p-6 text-center">
                <Award className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="font-semibold">{cert}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Security Practices */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12 border border-border mb-16">
          <h2 className="text-3xl font-serif font-bold mb-8">Our Security Practices</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Data Protection
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• End-to-end encryption for all data</li>
                <li>• Secure key management</li>
                <li>• Regular security audits</li>
                <li>• Penetration testing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Access Control
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Multi-factor authentication</li>
                <li>• Role-based access control</li>
                <li>• Audit logging</li>
                <li>• Session management</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Have security questions?</h2>
          <p className="text-lg text-muted-foreground mb-6">Our security team is here to help.</p>
          <button
            onClick={() => navigate("/contact")}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Contact Security Team
          </button>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
