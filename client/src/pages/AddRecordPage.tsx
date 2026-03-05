import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { Shield, ArrowLeft, Save, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Footer from "@/components/layout/Footer";

/**
 * MediVault Add Medical Record Page
 * Design: Modern Healthcare Minimalism
 * - Form to create new medical records
 * - Patient, doctor, and hospital selection
 * - Record type and details
 * - Blockchain integration
 */
export default function AddRecordPage() {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    recordType: "",
    visitDate: "",
    chiefComplaint: "",
    diagnosis: "",
    treatment: "",
    prescriptions: "",
    labOrders: "",
    notes: "",
  });

  const recordTypes = [
    "Consultation Notes",
    "Lab Reports",
    "Imaging Reports (X-Ray, MRI, CT Scan)",
    "Prescriptions",
    "Vaccination Records",
    "Discharge Summaries",
    "Surgical Records",
    "Medical Certificates",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.patientId || !formData.recordType || !formData.visitDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Medical record created and added to blockchain!");
      navigate("/view-records");
    } catch (error) {
      toast.error("Failed to create record");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Draft saved successfully");
    } catch (error) {
      toast.error("Failed to save draft");
    } finally {
      setLoading(false);
    }
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
              <h1 className="text-2xl font-serif font-bold text-primary">Add Medical Record</h1>
              <p className="text-sm text-muted-foreground">Create a new medical record with blockchain verification</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Form Sections */}
          <div className="space-y-8">
            {/* Patient & Doctor Section */}
            <div className="card-elevated p-8 space-y-6">
              <h3 className="text-xl font-serif font-bold flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                Patient & Provider Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Patient ID *</label>
                  <Select value={formData.patientId} onValueChange={(value) => handleInputChange("patientId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P001">John Doe (P001)</SelectItem>
                      <SelectItem value="P002">Jane Smith (P002)</SelectItem>
                      <SelectItem value="P003">Robert Johnson (P003)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Doctor Name</label>
                  <Input
                    type="text"
                    placeholder="Dr. Sarah Johnson"
                    disabled
                    value="Dr. Sarah Johnson"
                    className="bg-muted"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hospital Name</label>
                  <Input
                    type="text"
                    placeholder="City General Hospital"
                    disabled
                    value="City General Hospital"
                    className="bg-muted"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date of Visit *</label>
                  <Input
                    type="date"
                    value={formData.visitDate}
                    onChange={(e) => handleInputChange("visitDate", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Record Details Section */}
            <div className="card-elevated p-8 space-y-6">
              <h3 className="text-xl font-serif font-bold">Record Details</h3>

              <div>
                <label className="block text-sm font-medium mb-2">Record Type *</label>
                <Select value={formData.recordType} onValueChange={(value) => handleInputChange("recordType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Chief Complaint</label>
                <textarea
                  placeholder="Describe the patient's chief complaint"
                  value={formData.chiefComplaint}
                  onChange={(e) => handleInputChange("chiefComplaint", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Diagnosis/Findings</label>
                <textarea
                  placeholder="Enter diagnosis and clinical findings"
                  value={formData.diagnosis}
                  onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Treatment Plan</label>
                <textarea
                  placeholder="Describe the treatment plan"
                  value={formData.treatment}
                  onChange={(e) => handleInputChange("treatment", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Prescriptions</label>
                  <textarea
                    placeholder="List prescribed medications"
                    value={formData.prescriptions}
                    onChange={(e) => handleInputChange("prescriptions", e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Lab Orders</label>
                  <textarea
                    placeholder="List any lab tests ordered"
                    value={formData.labOrders}
                    onChange={(e) => handleInputChange("labOrders", e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Additional Notes</label>
                <textarea
                  placeholder="Any additional clinical notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Blockchain Info */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-primary">Blockchain Verification</p>
                  <p className="text-sm text-muted-foreground">This record will be automatically added to the blockchain with a unique SHA-256 hash for immutability and verification.</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="border-border hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveDraft}
                disabled={loading}
                variant="outline"
                className="border-border hover:bg-muted"
              >
                {loading ? "Saving..." : "Save as Draft"}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-primary text-primary-foreground hover:opacity-90"
              >
                {loading ? "Creating..." : "Create & Submit"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
