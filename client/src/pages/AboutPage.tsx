import { Shield, Users, Target, Heart } from "lucide-react";
import { useLocation } from "wouter";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  const [, navigate] = useLocation();

  const team = [
    { name: "Dr. Sarah Johnson", role: "CEO & Co-founder", bio: "Healthcare innovator with 15+ years in medical technology" },
    { name: "Alex Chen", role: "CTO & Co-founder", bio: "Blockchain expert and security specialist" },
    { name: "Dr. Michael Brown", role: "Chief Medical Officer", bio: "Board-certified physician and healthcare consultant" },
    { name: "Emma Davis", role: "VP of Operations", bio: "Healthcare operations and compliance expert" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Patient-Centric",
      description: "We put patients' needs and privacy first in everything we do."
    },
    {
      icon: Shield,
      title: "Security First",
      description: "Security and privacy are not afterthoughts but core principles."
    },
    {
      icon: Target,
      title: "Innovation",
      description: "We continuously innovate to provide the best solutions."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We work with healthcare providers to improve patient outcomes."
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
          <h1 className="text-5xl font-serif font-bold mb-4">About MediVault</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            We're on a mission to revolutionize how medical records are managed and secured.
          </p>
        </section>

        {/* Mission Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12 border border-border mb-16">
          <h2 className="text-3xl font-serif font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-6">
            To empower patients and healthcare providers with a secure, transparent, and user-friendly platform for managing medical records. We believe that healthcare data should be owned and controlled by patients, not locked away in proprietary systems.
          </p>
          <p className="text-lg text-muted-foreground">
            Using blockchain technology and military-grade encryption, we're building the future of healthcare data management.
          </p>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="card-elevated p-6 space-y-4 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold mb-8">Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, idx) => (
              <div key={idx} className="card-elevated p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-lg mb-1">{member.name}</h3>
                <p className="text-sm text-primary font-semibold mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="card-elevated p-6 text-center">
            <p className="text-4xl font-serif font-bold text-primary mb-2">10K+</p>
            <p className="text-muted-foreground">Active Users</p>
          </div>
          <div className="card-elevated p-6 text-center">
            <p className="text-4xl font-serif font-bold text-primary mb-2">1M+</p>
            <p className="text-muted-foreground">Records Secured</p>
          </div>
          <div className="card-elevated p-6 text-center">
            <p className="text-4xl font-serif font-bold text-primary mb-2">50+</p>
            <p className="text-muted-foreground">Healthcare Partners</p>
          </div>
          <div className="card-elevated p-6 text-center">
            <p className="text-4xl font-serif font-bold text-primary mb-2">99.9%</p>
            <p className="text-muted-foreground">Uptime</p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Join us in securing healthcare</h2>
          <p className="text-lg text-muted-foreground mb-6">Be part of the revolution in medical record management.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started Today
          </button>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
