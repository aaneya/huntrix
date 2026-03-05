import { Shield, CheckCircle, Award, FileText } from "lucide-react";
import { useLocation } from "wouter";
import Footer from "@/components/layout/Footer";

export default function CompliancePage() {
  const [, navigate] = useLocation();

  const certifications = [
    {
      icon: Award,
      title: "HIPAA",
      description: "Health Insurance Portability and Accountability Act compliance for healthcare data protection."
    },
    {
      icon: Award,
      title: "GDPR",
      description: "General Data Protection Regulation compliance for European data privacy standards."
    },
    {
      icon: Award,
      title: "CCPA",
      description: "California Consumer Privacy Act compliance for California resident data rights."
    },
    {
      icon: Award,
      title: "ISO 27001",
      description: "International standard for information security management systems."
    },
    {
      icon: Award,
      title: "SOC 2 Type II",
      description: "Service Organization Control audit for security, availability, and confidentiality."
    },
    {
      icon: Award,
      title: "HITECH Act",
      description: "Health Information Technology for Economic and Clinical Health Act compliance."
    }
  ];

  const standards = [
    {
      icon: CheckCircle,
      title: "Data Encryption",
      items: [
        "AES-256 encryption for data at rest",
        "TLS 1.3 for data in transit",
        "End-to-end encryption for medical records",
        "Secure key management"
      ]
    },
    {
      icon: CheckCircle,
      title: "Access Control",
      items: [
        "Multi-factor authentication",
        "Role-based access control",
        "Audit logging for all access",
        "Session management"
      ]
    },
    {
      icon: CheckCircle,
      title: "Data Protection",
      items: [
        "Regular security audits",
        "Penetration testing",
        "Vulnerability assessments",
        "Incident response procedures"
      ]
    },
    {
      icon: CheckCircle,
      title: "Privacy",
      items: [
        "Privacy by design",
        "Data minimization",
        "User consent management",
        "Right to be forgotten"
      ]
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
          <h1 className="text-5xl font-serif font-bold mb-4">Compliance & Certifications</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            MediVault is committed to meeting and exceeding all healthcare compliance requirements and industry standards.
          </p>
        </section>

        {/* Certifications Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold mb-8">Our Certifications</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, idx) => {
              const Icon = cert.icon;
              return (
                <div key={idx} className="card-elevated p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-serif font-bold text-lg mb-2">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Compliance Standards */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold mb-8">Compliance Standards</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {standards.map((standard, idx) => {
              const Icon = standard.icon;
              return (
                <div key={idx} className="card-elevated p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                    <h3 className="font-serif font-bold text-lg">{standard.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {standard.items.map((item, iidx) => (
                      <li key={iidx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Documentation */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold mb-8">Documentation & Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-elevated p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-serif font-bold text-lg mb-2">Security Whitepaper</h4>
                  <p className="text-sm text-muted-foreground mb-4">Comprehensive overview of our security architecture and practices.</p>
                  <button className="text-primary text-sm font-semibold hover:underline">Download PDF</button>
                </div>
              </div>
            </div>
            <div className="card-elevated p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-serif font-bold text-lg mb-2">Compliance Checklist</h4>
                  <p className="text-sm text-muted-foreground mb-4">Detailed checklist of all compliance requirements we meet.</p>
                  <button className="text-primary text-sm font-semibold hover:underline">Download PDF</button>
                </div>
              </div>
            </div>
            <div className="card-elevated p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-serif font-bold text-lg mb-2">Data Processing Agreement</h4>
                  <p className="text-sm text-muted-foreground mb-4">DPA template for GDPR and privacy compliance.</p>
                  <button className="text-primary text-sm font-semibold hover:underline">Download PDF</button>
                </div>
              </div>
            </div>
            <div className="card-elevated p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-serif font-bold text-lg mb-2">Audit Reports</h4>
                  <p className="text-sm text-muted-foreground mb-4">Latest SOC 2 and ISO 27001 audit reports.</p>
                  <button className="text-primary text-sm font-semibold hover:underline">Request Access</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12 border border-border text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Compliance Questions?</h2>
          <p className="text-lg text-muted-foreground mb-6">Our compliance team is ready to help with any questions about our certifications and standards.</p>
          <button
            onClick={() => navigate("/contact")}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Contact Compliance Team
          </button>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
