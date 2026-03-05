import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, User, Lock, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import Footer from "@/components/layout/Footer";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";

/**
 * MediVault Login/Registration Page
 * Design: Modern Healthcare Minimalism
 * - Tabbed interface for Login and Registration
 * - Traditional username/password authentication
 * - Registration form with role selection
 */
export default function LoginPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Registration form state
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regRole, setRegRole] = useState("");
  const [regDOB, setRegDOB] = useState("");
  const [regGender, setRegGender] = useState("");
  const [regAddress, setRegAddress] = useState("");

  // Handle traditional login
  const handleTraditionalLogin = async () => {
  if (!loginUsername || !loginPassword) {
    toast.error("Please enter username and password");
    return;
  }

  setLoading(true);
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 👇 USER SAVE KAR RAHE HAIN
    const userData = {
      name: loginUsername,
      email: loginUsername,
      role: "patient"
    };

    localStorage.setItem("user", JSON.stringify(userData));

    toast.success("Login successful!");
    navigate("/dashboard");

  } catch (error) {
    toast.error("Invalid credentials");
  } finally {
    setLoading(false);
  }
};

  // Handle registration
  const handleRegister = async () => {
    if (!regFullName || !regEmail || !regPhone || !regPassword || !regRole) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (regPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      // Simulate API call - in production this would call a backend endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Registration successful! Please login.");
      setActiveTab("login");
      setLoginUsername(regEmail);
      setRegFullName("");
      setRegEmail("");
      setRegPhone("");
      setRegPassword("");
      setRegConfirmPassword("");
      setRegRole("");
    } catch (error) {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
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
          <p className="text-sm text-muted-foreground">
            Secure Medical Records Management
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12">
        <div className="w-full max-w-md">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-6 mt-8">
              {/* Social Login Buttons */}
              <SocialLoginButtons disabled={loading} />

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Username or Email</label>
                  <Input
                    type="text"
                    placeholder="Enter your username or email"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={handleTraditionalLogin}
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:opacity-90"
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>

              {/* Info Box */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Demo Credentials:</strong> Use any username/password combination to test the interface.
                </p>
              </div>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="space-y-4 mt-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Role *</label>
                  <Select value={regRole} onValueChange={setRegRole} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="hospital">Hospital Admin</SelectItem>
                      <SelectItem value="insurance">Insurance Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date of Birth</label>
                    <Input
                      type="date"
                      value={regDOB}
                      onChange={(e) => setRegDOB(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Gender</label>
                    <Select value={regGender} onValueChange={setRegGender} disabled={loading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <Input
                    type="text"
                    placeholder="123 Main Street, City"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Password *</label>
                  <Input
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password *</label>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <Button
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:opacity-90 py-6"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>By continuing, you agree to our <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a></p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
