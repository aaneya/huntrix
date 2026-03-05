import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { Shield, ArrowLeft, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Footer from "@/components/layout/Footer";

/**
 * MediVault Verify Records Page
 * Design: Modern Healthcare Minimalism
 * - Verify records by hash
 * - Upload documents for verification
 * - Display verification results
 * - Verification history
 */
export default function VerifyRecordsPage() {
  const [, navigate] = useLocation();
  const [verificationMethod, setVerificationMethod] = useState("hash");
  const [recordHash, setRecordHash] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const verificationHistory = [
    { hash: "0x7f3a9b2c...", status: "Valid", date: "2026-02-20", result: "verified" },
    { hash: "0x4d2e5f8a...", status: "Valid", date: "2026-02-18", result: "verified" },
    { hash: "0x9c1b3e7d...", status: "Invalid", date: "2026-02-15", result: "tampered" },
    { hash: "0x2a6f4c9e...", status: "Valid", date: "2026-02-10", result: "verified" },
  ];

  const handleVerifyHash = async () => {
    if (!recordHash) {
      toast.error("Please enter a record hash");
      return;
    }
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate verification result
      const isValid = Math.random() > 0.2; // 80% valid, 20% invalid
      setVerificationResult({
        hash: recordHash,
        status: isValid ? "Valid" : "Invalid",
        result: isValid ? "verified" : "tampered",
        blockNumber: "15,847,293",
        timestamp: new Date().toISOString(),
        patient: "John Doe",
        doctor: "Dr. Sarah Johnson",
        recordType: "Consultation Notes",
        diagnosis: "Hypertension",
      });
      
      if (isValid) {
        toast.success("Record verified successfully!");
      } else {
        toast.error("Record verification failed - possible tampering detected");
      }
    } catch (error) {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async () => {
    toast.info("Document upload feature would open file picker");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-serif font-bold text-primary">Verify Records</h1>
              <p className="text-sm text-muted-foreground">Verify the authenticity of medical records on blockchain</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Verification Input Section */}
          <div className="card-elevated p-8 space-y-6">
            <h3 className="text-xl font-serif font-bold">Verify Record</h3>

            {/* Method Selector */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => { setVerificationMethod("hash"); setVerificationResult(null); }}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  verificationMethod === "hash"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Verify by Hash
              </button>
              <button
                onClick={() => { setVerificationMethod("upload"); setVerificationResult(null); }}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  verificationMethod === "upload"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                Upload Document
              </button>
            </div>

            {/* Hash Verification */}
            {verificationMethod === "hash" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Record Hash</label>
                  <Input
                    type="text"
                    placeholder="Enter blockchain hash (e.g., 0x7f3a9b2c...)"
                    value={recordHash}
                    onChange={(e) => setRecordHash(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Enter the SHA-256 hash of the record you want to verify
                  </p>
                </div>
                <Button
                  onClick={handleVerifyHash}
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:opacity-90"
                >
                  {loading ? "Verifying..." : "Verify Hash"}
                </Button>
              </div>
            )}

            {/* Document Upload */}
            {verificationMethod === "upload" && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <Shield className="w-12 h-12 text-primary/50" />
                    </div>
                    <div>
                      <p className="font-semibold">Drag and drop your document</p>
                      <p className="text-sm text-muted-foreground">or click to browse</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: PDF, JPG, PNG, DOCX (Max 10MB)
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleUploadDocument}
                  className="w-full bg-primary text-primary-foreground hover:opacity-90"
                >
                  Select Document
                </Button>
              </div>
            )}
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <div className={`rounded-lg p-8 border-2 space-y-6 ${
              verificationResult.result === "verified"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}>
              <div className="flex items-start gap-4">
                {verificationResult.result === "verified" ? (
                  <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                )}
                <div>
                  <h4 className={`text-xl font-serif font-bold ${
                    verificationResult.result === "verified" ? "text-green-900" : "text-red-900"
                  }`}>
                    {verificationResult.result === "verified" ? "Record Verified" : "Record Invalid"}
                  </h4>
                  <p className={`text-sm ${
                    verificationResult.result === "verified" ? "text-green-700" : "text-red-700"
                  }`}>
                    {verificationResult.result === "verified"
                      ? "This record has been verified on the blockchain and is authentic."
                      : "This record has been tampered with or is not found on the blockchain."}
                  </p>
                </div>
              </div>

              {/* Result Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Record Hash</p>
                  <p className="font-mono text-sm mt-1">{verificationResult.hash}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Block Number</p>
                  <p className="font-semibold mt-1">{verificationResult.blockNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Patient</p>
                  <p className="font-semibold mt-1">{verificationResult.patient}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Doctor</p>
                  <p className="font-semibold mt-1">{verificationResult.doctor}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Record Type</p>
                  <p className="font-semibold mt-1">{verificationResult.recordType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Diagnosis</p>
                  <p className="font-semibold mt-1">{verificationResult.diagnosis}</p>
                </div>
              </div>

              <Button
                onClick={() => setVerificationResult(null)}
                variant="outline"
                className="w-full border-border hover:bg-muted"
              >
                Verify Another Record
              </Button>
            </div>
          )}

          {/* Verification History */}
          <div className="card-elevated p-8 space-y-6">
            <h3 className="text-xl font-serif font-bold">Verification History</h3>
            <div className="space-y-3">
              {verificationHistory.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    {item.result === "verified" ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-mono text-sm">{item.hash}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.result === "verified"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Information Box */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-3">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-primary">How Verification Works</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Each medical record is assigned a unique SHA-256 hash and stored on the blockchain. When you verify a record, we check if the hash exists on the blockchain and hasn't been tampered with. If the record has been modified, the hash will no longer match and verification will fail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
