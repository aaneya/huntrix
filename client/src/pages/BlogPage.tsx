import { Shield, Calendar, User } from "lucide-react";
import { useLocation } from "wouter";
import Footer from "@/components/layout/Footer";

export default function BlogPage() {
  const [, navigate] = useLocation();

  const posts = [
    {
      id: 1,
      title: "The Future of Healthcare Data Management",
      excerpt: "Exploring how blockchain technology is revolutionizing medical record management and patient privacy.",
      author: "Dr. Sarah Johnson",
      date: "March 15, 2026",
      category: "Technology"
    },
    {
      id: 2,
      title: "HIPAA Compliance in the Digital Age",
      excerpt: "Understanding HIPAA requirements and how modern platforms ensure healthcare data security.",
      author: "Alex Chen",
      date: "March 10, 2026",
      category: "Compliance"
    },
    {
      id: 3,
      title: "Patient Empowerment Through Data Ownership",
      excerpt: "Why patients should have full control over their medical records and how it improves outcomes.",
      author: "Dr. Michael Brown",
      date: "March 5, 2026",
      category: "Healthcare"
    },
    {
      id: 4,
      title: "Security Best Practices for Medical Records",
      excerpt: "Essential security measures every healthcare provider should implement to protect patient data.",
      author: "Emma Davis",
      date: "February 28, 2026",
      category: "Security"
    },
    {
      id: 5,
      title: "Blockchain Verification: Ensuring Record Authenticity",
      excerpt: "How blockchain technology provides immutable proof of medical record authenticity and integrity.",
      author: "Alex Chen",
      date: "February 20, 2026",
      category: "Technology"
    },
    {
      id: 6,
      title: "The Rise of Telemedicine and Secure Record Sharing",
      excerpt: "Adapting to remote healthcare while maintaining the highest standards of data security.",
      author: "Dr. Sarah Johnson",
      date: "February 15, 2026",
      category: "Healthcare"
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
          <h1 className="text-5xl font-serif font-bold mb-4">MediVault Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Insights, updates, and best practices for secure medical record management.
          </p>
        </section>

        {/* Blog Posts */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {posts.map((post) => (
            <article key={post.id} className="card-elevated p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                  {post.category}
                </span>
              </div>
              <h3 className="font-serif font-bold text-lg mb-3 line-clamp-2">{post.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-4">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Newsletter Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12 border border-border text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Stay Updated</h2>
          <p className="text-lg text-muted-foreground mb-6">Subscribe to our newsletter for the latest healthcare insights.</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
