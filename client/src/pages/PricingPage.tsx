import { Shield, Check } from "lucide-react";
import { useLocation } from "wouter";
import Footer from "@/components/layout/Footer";

export default function PricingPage() {
  const [, navigate] = useLocation();

  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for individuals",
      features: [
        "Up to 100 medical records",
        "5 GB storage",
        "Basic encryption",
        "Email support",
        "Record sharing (limited)"
      ],
      cta: "Get Started"
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "For healthcare professionals",
      features: [
        "Unlimited medical records",
        "100 GB storage",
        "Military-grade encryption",
        "Priority support",
        "Advanced record sharing",
        "Blockchain verification",
        "Audit logging"
      ],
      cta: "Get Started",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For healthcare organizations",
      features: [
        "Unlimited records & storage",
        "Custom encryption",
        "24/7 dedicated support",
        "Team management",
        "Advanced analytics",
        "API access",
        "Custom compliance"
      ],
      cta: "Contact Sales"
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
        <section className="mb-16 text-center">
          <h1 className="text-5xl font-serif font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your medical record management needs.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`rounded-2xl p-8 border transition-all ${
                plan.highlighted 
                  ? "card-elevated border-primary shadow-lg scale-105" 
                  : "card-elevated border-border"
              }`}
            >
              <h3 className="text-2xl font-serif font-bold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground mb-6">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-serif font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-2">{plan.period}</span>
              </div>
              <button
                onClick={() => navigate("/login")}
                className={`w-full py-3 rounded-lg font-semibold mb-8 transition-all ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border hover:bg-muted"
                }`}
              >
                {plan.cta}
              </button>
              <ul className="space-y-4">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* FAQ Section */}
        <section className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-12 border border-border">
          <h2 className="text-3xl font-serif font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-2">Can I change plans?</h4>
              <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Is there a free trial?</h4>
              <p className="text-muted-foreground">Yes, we offer a 14-day free trial with full access to all features.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
              <p className="text-muted-foreground">We accept all major credit cards, bank transfers, and digital payment methods.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Is my data secure?</h4>
              <p className="text-muted-foreground">Absolutely. All data is encrypted with military-grade encryption and stored securely.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
