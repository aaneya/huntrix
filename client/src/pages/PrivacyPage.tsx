import { Shield } from "lucide-react";
import { useLocation } from "wouter";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
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
      <main className="container mx-auto px-4 py-12 flex-grow max-w-4xl">
        <h1 className="text-5xl font-serif font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: March 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-serif font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">
              MediVault ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Personal Data: Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
              <li>Medical Data: Health information and medical records that you voluntarily upload or store on our platform.</li>
              <li>Financial Data: Financial information, such as data related to your payment method, that we may collect when you purchase, order, return, exchange, or request information about our services from the Site.</li>
              <li>Data From Social Networks: User information from social networks, including your name, your social network username, location, gender, birth date, email address, profile picture, and public data for contacts.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold mb-4">3. Use of Your Information</h2>
            <p className="text-muted-foreground mb-4">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Create and manage your account</li>
              <li>Process your transactions and send related information</li>
              <li>Email you regarding your account or order</li>
              <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site</li>
              <li>Generate a personal profile about you</li>
              <li>Increase the efficiency and operation of the Site</li>
              <li>Monitor and analyze usage and trends to improve your experience with the Site</li>
              <li>Notify you of updates to the Site</li>
              <li>Offer new products, services, and/or recommendations to you</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold mb-4">4. Disclosure of Your Information</h2>
            <p className="text-muted-foreground mb-4">We may share information we have collected about you in certain situations:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>By Law or to Protect Rights: If we believe the release of information about you is necessary to comply with the law, enforce our Site policies, or protect ours or others' rights, property, or safety.</li>
              <li>Third-Party Service Providers: We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
              <li>Business Transfers: If MediVault is involved in a merger, acquisition, or sale of all or a portion of its assets, you will be notified via email and/or a prominent notice on our Site of any change in ownership or uses of your personal information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold mb-4">5. Security of Your Information</h2>
            <p className="text-muted-foreground">
              We use administrative, technical, and physical security measures to protect your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold mb-4">6. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-4 text-muted-foreground">
              <p>MediVault Privacy Team</p>
              <p>Email: privacy@medivault.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Healthcare Boulevard, San Francisco, CA 94105, USA</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
