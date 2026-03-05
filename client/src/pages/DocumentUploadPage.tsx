import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { Shield, ArrowLeft, Upload, CheckCircle, FileText, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Footer from "@/components/layout/Footer";

/**
 * MediVault Document Upload Page
 * Design: Modern Healthcare Minimalism
 * - Drag and drop file upload
 * - Document type selection
 * - Patient association
 * - Encryption options
 * - Upload progress tracking
 */
export default function DocumentUploadPage() {
  const [, navigate] = useLocation();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [documentType, setDocumentType] = useState("");
  const [patientId, setPatientId] = useState("");
  const [encrypt, setEncrypt] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const documentTypes = [
    "Consultation Notes",
    "Lab Reports",
    "Imaging Reports (X-Ray, MRI, CT Scan)",
    "Prescriptions",
    "Vaccination Records",
    "Discharge Summaries",
    "Surgical Records",
    "Medical Certificates",
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    toast.success(`${newFiles.length} file(s) selected`);
  };

  const handleBrowse = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".pdf,.jpg,.jpeg,.png,.docx";
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        handleFiles(files);
      }
    };
    input.click();
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("Please select at least one file");
      return;
    }
    if (!documentType) {
      toast.error("Please select a document type");
      return;
    }
    if (!patientId) {
      toast.error("Please select a patient");
      return;
    }

    setUploading(true);
    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      toast.success("Documents uploaded and encrypted successfully!");
      setUploadedFiles([]);
      setDocumentType("");
      setPatientId("");
      setUploadProgress(0);
      navigate("/view-records");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
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
              <h1 className="text-2xl font-serif font-bold text-primary">Upload Documents</h1>
              <p className="text-sm text-muted-foreground">Upload and encrypt medical documents</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Area */}
          <div className="card-elevated p-8 space-y-6">
            <h3 className="text-xl font-serif font-bold">Select Documents</h3>

            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-primary/2.5"
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-center">
                  <Upload className="w-12 h-12 text-primary/50" />
                </div>
                <div>
                  <p className="font-semibold">Drag and drop your documents here</p>
                  <p className="text-sm text-muted-foreground">or click below to browse</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, JPG, PNG, DOCX (Max 10MB each)
                </p>
              </div>
            </div>

            <Button
              onClick={handleBrowse}
              variant="outline"
              className="w-full border-border hover:bg-muted py-6"
            >
              <FileText className="w-4 h-4 mr-2" />
              Browse Files
            </Button>
          </div>

          {/* Document Configuration */}
          <div className="card-elevated p-8 space-y-6">
            <h3 className="text-xl font-serif font-bold">Document Details</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Document Type *</label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Associate with Patient *</label>
                <Select value={patientId} onValueChange={setPatientId}>
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
            </div>

            {/* Encryption Option */}
            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <input
                type="checkbox"
                id="encrypt"
                checked={encrypt}
                onChange={(e) => setEncrypt(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="encrypt" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  <span className="font-medium">Encrypt Document</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: Encrypt documents for enhanced security
                </p>
              </label>
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="card-elevated p-8 space-y-6">
              <h3 className="text-xl font-serif font-bold">Selected Files ({uploadedFiles.length})</h3>

              <div className="space-y-3">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(idx)}
                      disabled={uploading}
                      className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="card-elevated p-8 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">Uploading documents...</p>
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Security Information */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-primary">Security & Privacy</p>
                <p className="text-sm text-muted-foreground mt-2">
                  All uploaded documents are automatically encrypted using AES-256 encryption. Once uploaded, documents are associated with a blockchain hash for verification and tamper detection. Your documents remain under your control, and you can revoke access at any time.
                </p>
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
              onClick={handleUpload}
              disabled={uploading || uploadedFiles.length === 0}
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              {uploading ? "Uploading..." : "Upload & Encrypt"}
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
