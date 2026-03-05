import { Shield, Lock, Zap, Users, FileText, CheckCircle, TrendingUp, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import Footer from "@/components/layout/Footer";

export default function FeaturesPage() {
  const [, navigate] = useLocation();

  const features = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All medical records are encrypted with military-grade AES-256 encryption, ensuring maximum security and privacy."
    },
    {
      icon: Shield,
      title: "Blockchain Verification",
      description: "Records are verified and stored on blockchain, providing immutable proof of authenticity and integrity."
    },
    {
      icon: Users,
      title: "Secure Sharing",
      description: "Share medical records with healthcare providers with granular permission controls and audit trails."
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "Access your medical records anytime, anywhere with our responsive web and mobile applications."
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Upload, organize, and manage all types of medical documents in one secure location."
    },
    {
      icon: CheckCircle,
      title: "Compliance Ready",
      description: "Fully compliant with HIPAA, GDPR, and other healthcare regulations for peace of mind."
    },
    {
      icon: TrendingUp,
      title: "Health Analytics",
      description: "Get insights into your health trends with advanced analytics and visualization tools."
    },
    {
      icon: BarChart3,
      title: "Audit Logging",
      description: "Complete audit trails for all record access and modifications for accountability."
    }
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
          <h1 className="text-5xl font-serif font-bold mb-4">Powerful Features</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Discover the comprehensive features that make MediVault the most secure medical record management system.
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="card-elevated p-6 space-y-4 hover:shadow-lg transition-shadow">
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

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12 text-center border border-border">
          <h2 className="text-3xl font-serif font-bold mb-4">Ready to secure your medical records?</h2>
          <p className="text-lg text-muted-foreground mb-6">Join thousands of healthcare professionals using MediVault.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started
          </button>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
