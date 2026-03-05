import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { Shield, ArrowLeft, Download, Share2, CheckCircle, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Footer from "@/components/layout/Footer";

/**
 * MediVault View Records Page
 * Design: Modern Healthcare Minimalism
 * - Search and filter medical records
 * - Display records in table format
 * - Actions: view, download, share, verify
 */
export default function ViewRecordsPage() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  const records = [
    {
      id: "REC001",
      date: "2026-02-20",
      patient: "John Doe",
      doctor: "Dr. Sarah Johnson",
      type: "Consultation Notes",
      diagnosis: "Hypertension",
      status: "Verified",
      hash: "0x7f3a9b2c...",
    },
    {
      id: "REC002",
      date: "2026-02-15",
      patient: "Jane Smith",
      doctor: "Dr. Michael Brown",
      type: "Lab Reports",
      diagnosis: "Blood Work Analysis",
      status: "Verified",
      hash: "0x4d2e5f8a...",
    },
    {
      id: "REC003",
      date: "2026-02-10",
      patient: "Robert Johnson",
      doctor: "Dr. Sarah Johnson",
      type: "Imaging Reports",
      diagnosis: "Chest X-Ray",
      status: "Verified",
      hash: "0x9c1b3e7d...",
    },
    {
      id: "REC004",
      date: "2026-02-05",
      patient: "John Doe",
      doctor: "Dr. Emily Davis",
      type: "Prescriptions",
      diagnosis: "Medication Prescription",
      status: "Verified",
      hash: "0x2a6f4c9e...",
    },
    {
      id: "REC005",
      date: "2026-01-28",
      patient: "Jane Smith",
      doctor: "Dr. Sarah Johnson",
      type: "Vaccination Records",
      diagnosis: "Annual Vaccination",
      status: "Verified",
      hash: "0x5e8d1f3a...",
    },
  ];

  const recordTypes = [
    "All Types",
    "Consultation Notes",
    "Lab Reports",
    "Imaging Reports",
    "Prescriptions",
    "Vaccination Records",
    "Discharge Summaries",
    "Surgical Records",
  ];

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || filterType === "All Types" || record.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleViewDetails = (recordId: string) => {
    setSelectedRecord(recordId);
    toast.info("Record details panel would open here");
  };

  const handleDownload = (recordId: string) => {
    toast.success(`Record ${recordId} downloaded successfully`);
  };

  const handleShare = (recordId: string) => {
    toast.info("Share dialog would open here");
  };

  const handleVerify = (recordId: string) => {
    toast.success(`Record ${recordId} verified on blockchain`);
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
              <h1 className="text-2xl font-serif font-bold text-primary">View Records</h1>
              <p className="text-sm text-muted-foreground">Browse and manage your medical records</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="space-y-8">
          {/* Search and Filter Section */}
          <div className="card-elevated p-6 space-y-4">
            <h3 className="text-lg font-serif font-bold">Search & Filter</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Search Records</label>
                <Input
                  type="text"
                  placeholder="Search by patient, doctor, or diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Record Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date Range</label>
                <Input
                  type="date"
                  placeholder="Filter by date"
                />
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="card-elevated overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Patient</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Doctor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Diagnosis</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <tr key={record.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-sm">{record.date}</td>
                        <td className="px-6 py-4 text-sm font-medium">{record.patient}</td>
                        <td className="px-6 py-4 text-sm">{record.doctor}</td>
                        <td className="px-6 py-4 text-sm">{record.type}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{record.diagnosis}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-medium">{record.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(record.id)}
                              className="p-1 hover:bg-primary/10 rounded transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-primary" />
                            </button>
                            <button
                              onClick={() => handleDownload(record.id)}
                              className="p-1 hover:bg-primary/10 rounded transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4 text-primary" />
                            </button>
                            <button
                              onClick={() => handleShare(record.id)}
                              className="p-1 hover:bg-primary/10 rounded transition-colors"
                              title="Share"
                            >
                              <Share2 className="w-4 h-4 text-primary" />
                            </button>
                            <button
                              onClick={() => handleVerify(record.id)}
                              className="p-1 hover:bg-primary/10 rounded transition-colors"
                              title="Verify"
                            >
                              <CheckCircle className="w-4 h-4 text-primary" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                        No records found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Record Details Panel (if selected) */}
          {selectedRecord && (
            <div className="card-elevated p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif font-bold">Record Details</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Record ID</p>
                  <p className="font-semibold">{selectedRecord}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blockchain Hash</p>
                  <p className="font-mono text-sm">{records.find(r => r.id === selectedRecord)?.hash}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
