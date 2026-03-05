import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Shield, Plus, FileText, Upload, CheckCircle, Settings, LogOut, TrendingUp, Calendar, HardDrive } from "lucide-react";
import { useState, useEffect } from "react";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

/**
 * MediVault Dashboard Page
 * Design: Modern Healthcare Minimalism
 * - Welcome message with user info
 * - Quick stats cards
 * - Navigation buttons for main features
 * - Recent activity
 */
export default function DashboardPage() {
  const [, navigate] = useLocation();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login"); // 🔒 agar login nahi hai
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.name);
      setUserRole(parsedUser.role);
    }
  }, []);
  

  const stats = [
    { label: "Total Records", value: "24", icon: FileText, color: "bg-primary/10" },
    { label: "This Month", value: "8", icon: Calendar, color: "bg-accent/10" },
    { label: "Pending Verifications", value: "3", icon: CheckCircle, color: "bg-secondary/10" },
    { label: "Storage Used", value: "2.4 GB", icon: HardDrive, color: "bg-primary/10" },
  ];

  const features = [
    { label: "Add New Record", icon: Plus, path: "/add-record", description: "Create a new medical record" },
    { label: "View Records", icon: FileText, path: "/view-records", description: "Browse and manage records" },
    { label: "Upload Document", icon: Upload, path: "/upload-document", description: "Upload medical documents" },
    { label: "Verify Records", icon: CheckCircle, path: "/verify-records", description: "Verify record authenticity" },
  ];

  const recentActivity = [
    { type: "created", text: "Created new consultation note", time: "2 hours ago" },
    { type: "verified", text: "Lab report verified on blockchain", time: "5 hours ago" },
    { type: "shared", text: "Shared vaccination record with patient", time: "1 day ago" },
    { type: "verified", text: "Prescription record confirmed", time: "2 days ago" },
  ];

  const handleLogout = () => {
  localStorage.removeItem("user");
  toast.success("Logged out successfully");
  navigate("/login");
};

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-primary">MediVault</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">SJ</span>
              </div>
              <div>
                <p className="text-sm font-semibold">{userName}</p>
                <p className="text-xs text-muted-foreground">{userRole}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-border hover:bg-muted"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        {/* Welcome Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-border">
            <h2 className="text-4xl font-serif font-bold mb-2">Welcome back, {userName}!</h2>
            <p className="text-lg text-muted-foreground">
              You're logged in as a <span className="font-semibold text-primary">{userRole}</span>. Manage your medical records securely with blockchain verification.
            </p>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="mb-12">
          <h3 className="text-2xl font-serif font-bold mb-6">Quick Overview</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="card-elevated p-6 space-y-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-serif font-bold text-primary">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Feature Cards */}
        <section className="mb-12">
          <h3 className="text-2xl font-serif font-bold mb-6">Main Features</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(feature.path)}
                  className="card-elevated p-6 space-y-4 text-left hover:shadow-lg transition-shadow group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg">{feature.label}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-serif font-bold">Recent Activity</h3>
            <Button
              variant="outline"
              size="sm"
              className="border-border hover:bg-muted"
            >
              View All
            </Button>
          </div>
          <div className="card-elevated p-6 space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-4 pb-4 last:pb-0 border-b border-border last:border-0">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.text}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Settings Section */}
        <section>
          <h3 className="text-2xl font-serif font-bold mb-6">Account Settings</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Button
              onClick={() => toast.info("Settings page coming soon")}
              className="card-elevated p-6 h-auto flex items-center gap-4 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Profile Settings</p>
                <p className="text-sm text-muted-foreground">Manage your account information</p>
              </div>
            </Button>
            <Button
              onClick={() => toast.info("Security settings coming soon")}
              className="card-elevated p-6 h-auto flex items-center gap-4 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Security & Privacy</p>
                <p className="text-sm text-muted-foreground">Manage security preferences</p>
              </div>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
