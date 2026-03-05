import { Shield, Mail, Phone, MapPin, Send } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "support@medivault.com",
      description: "We typically respond within 24 hours"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      description: "Available Monday to Friday, 9am-5pm EST"
    },
    {
      icon: MapPin,
      title: "Address",
      value: "123 Healthcare Boulevard",
      description: "San Francisco, CA 94105, USA"
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
          <h1 className="text-5xl font-serif font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Have questions? We'd love to hear from you. Get in touch with our team.
          </p>
        </section>

        {/* Contact Info */}
        <section className="grid md:grid-cols-3 gap-6 mb-16">
          {contactInfo.map((info, idx) => {
            const Icon = info.icon;
            return (
              <div key={idx} className="card-elevated p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-lg mb-2">{info.title}</h3>
                <p className="font-semibold text-primary mb-2">{info.value}</p>
                <p className="text-sm text-muted-foreground">{info.description}</p>
              </div>
            );
          })}
        </section>

        {/* Contact Form */}
        <section className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-8">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="How can we help?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary h-32 resize-none"
                  placeholder="Your message..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-3xl font-serif font-bold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="card-elevated p-6">
                <h4 className="font-semibold mb-2">What is your response time?</h4>
                <p className="text-sm text-muted-foreground">We aim to respond to all inquiries within 24 business hours.</p>
              </div>
              <div className="card-elevated p-6">
                <h4 className="font-semibold mb-2">Do you offer technical support?</h4>
                <p className="text-sm text-muted-foreground">Yes, our technical support team is available to help with any issues.</p>
              </div>
              <div className="card-elevated p-6">
                <h4 className="font-semibold mb-2">Can I schedule a demo?</h4>
                <p className="text-sm text-muted-foreground">Absolutely! Contact us and we'll arrange a personalized demo for your team.</p>
              </div>
              <div className="card-elevated p-6">
                <h4 className="font-semibold mb-2">Do you offer enterprise solutions?</h4>
                <p className="text-sm text-muted-foreground">Yes, we provide custom enterprise solutions tailored to your organization's needs.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
