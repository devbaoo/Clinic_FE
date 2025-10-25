import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Search, Plus, Eye, Edit, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MedicalRecord {
  id: number;
  patientName: string;
  patientId: string;
  age: number;
  bloodType: string;
  allergies: string[];
  chronicDiseases: string[];
  diagnoses: Array<{
    date: string;
    diagnosis: string;
    treatment: string;
  }>;
  lastCheckup: string;
  notes: string;
}

export default function MedicalRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newDiagnosis, setNewDiagnosis] = useState({
    diagnosis: "",
    treatment: "",
  });

  const [records, setRecords] = useState<MedicalRecord[]>([
    {
      id: 1,
      patientName: "Nguyễn Văn A",
      patientId: "123456789",
      age: 45,
      bloodType: "O+",
      allergies: ["Penicilin"],
      chronicDiseases: ["Tiểu đường loại 2"],
      diagnoses: [
        {
          date: "2025-01-15",
          diagnosis: "Khám tổng quát",
          treatment: "Kiểm tra sức khỏe định kỳ",
        },
        {
          date: "2025-01-01",
          diagnosis: "Tăng huyết áp",
          treatment: "Kê đơn thuốc kiểm soát huyết áp",
        },
      ],
      lastCheckup: "2025-01-15",
      notes: "Bệnh nhân kiểm soát tiểu đường tốt, cần theo dõi huyết áp",
    },
    {
      id: 2,
      patientName: "Trần Thị B",
      patientId: "987654321",
      age: 38,
      bloodType: "A+",
      allergies: ["Cephalosporin"],
      chronicDiseases: ["Hen suyễn"],
      diagnoses: [
        {
          date: "2025-01-10",
          diagnosis: "Cảm cúm",
          treatment: "Nghỉ ngơi, uống nước ấm, vitamin C",
        },
      ],
      lastCheckup: "2025-01-10",
      notes: "Bệnh nhân có tiền sử hen suyễn, cần theo dõi chặt chẽ",
    },
    {
      id: 3,
      patientName: "Phạm Văn C",
      patientId: "456789123",
      age: 62,
      bloodType: "B+",
      allergies: ["Aspirin"],
      chronicDiseases: ["Bệnh tim mạch", "Tiểu đường loại 2"],
      diagnoses: [
        {
          date: "2025-01-08",
          diagnosis: "Đau ngực",
          treatment: "Chụp CT, xét nghiệm máu, theo dõi định kỳ",
        },
        {
          date: "2024-12-20",
          diagnosis: "Kiểm tra định kỳ",
          treatment: "Điều chỉnh liều lượng thuốc tim mạch",
        },
      ],
      lastCheckup: "2025-01-08",
      notes: "Bệnh nhân đang điều trị bệnh tim mạch, cần theo dõi sát sao",
    },
  ]);

  const filteredRecords = records.filter(
    (record) =>
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patientId.includes(searchTerm)
  );

  const handleAddDiagnosis = () => {
    if (selectedRecord && newDiagnosis.diagnosis) {
      const updatedRecords = records.map((record) => {
        if (record.id === selectedRecord.id) {
          return {
            ...record,
            diagnoses: [
              ...record.diagnoses,
              {
                date: new Date().toISOString().split("T")[0],
                diagnosis: newDiagnosis.diagnosis,
                treatment: newDiagnosis.treatment,
              },
            ],
            lastCheckup: new Date().toISOString().split("T")[0],
          };
        }
        return record;
      });
      setRecords(updatedRecords);
      setSelectedRecord(updatedRecords.find((r) => r.id === selectedRecord.id) || null);
      setNewDiagnosis({ diagnosis: "", treatment: "" });
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Hồ sơ bệnh</h1>
          <p className="text-muted-foreground">
            Quản lý hồ sơ bệnh chi tiết của các bệnh nhân
          </p>
        </div>

        {/* Search Section */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên bệnh nhân hoặc số CMND..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Records List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Danh sách bệnh nhân
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <button
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className={`w-full p-4 rounded-lg text-left border transition-colors ${
                      selectedRecord?.id === record.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent/5"
                    }`}
                  >
                    <h3 className="font-medium text-foreground">
                      {record.patientName}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {record.patientId}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tuổi: {record.age}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Khám lần cuối:{" "}
                      {new Date(record.lastCheckup).toLocaleDateString("vi-VN")}
                    </p>
                  </button>
                ))
              ) : (
                <Card className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Không tìm thấy hồ sơ bệnh
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* Record Details */}
          <div className="lg:col-span-2">
            {selectedRecord ? (
              <div className="space-y-6">
                {/* Patient Header */}
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        {selectedRecord.patientName}
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        CMND: {selectedRecord.patientId}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tuổi</p>
                      <p className="text-lg font-semibold text-foreground">
                        {selectedRecord.age}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Nhóm máu
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {selectedRecord.bloodType}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Allergies & Chronic Diseases */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Allergies */}
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <h3 className="font-semibold text-foreground">Dị ứng</h3>
                    </div>
                    {selectedRecord.allergies.length > 0 ? (
                      <div className="space-y-2">
                        {selectedRecord.allergies.map((allergy, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-sm"
                          >
                            {allergy}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Không có dị ứng
                      </p>
                    )}
                  </Card>

                  {/* Chronic Diseases */}
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      <h3 className="font-semibold text-foreground">
                        Bệnh mãn tính
                      </h3>
                    </div>
                    {selectedRecord.chronicDiseases.length > 0 ? (
                      <div className="space-y-2">
                        {selectedRecord.chronicDiseases.map((disease, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-sm"
                          >
                            {disease}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Không có bệnh mãn tính
                      </p>
                    )}
                  </Card>
                </div>

                {/* Notes */}
                <Card className="p-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    Ghi chú y tế
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedRecord.notes}
                  </p>
                </Card>

                {/* Diagnoses */}
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-foreground">
                      Lịch sử chẩn đoán
                    </h3>
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Thêm chẩn đoán
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Thêm chẩn đoán mới</DialogTitle>
                          <DialogDescription>
                            Ghi lại chẩn đoán và phương pháp điều trị
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            <Label htmlFor="diagnosis">Chẩn đoán *</Label>
                            <Input
                              id="diagnosis"
                              placeholder="VD: Cảm cúm, Viêm họng..."
                              value={newDiagnosis.diagnosis}
                              onChange={(e) =>
                                setNewDiagnosis({
                                  ...newDiagnosis,
                                  diagnosis: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="treatment">Điều trị</Label>
                            <Textarea
                              id="treatment"
                              placeholder="Mô tả phương pháp điều trị"
                              value={newDiagnosis.treatment}
                              onChange={(e) =>
                                setNewDiagnosis({
                                  ...newDiagnosis,
                                  treatment: e.target.value,
                                })
                              }
                              rows={4}
                            />
                          </div>
                          <div className="flex gap-4">
                            <Button
                              variant="outline"
                              onClick={() => setOpenDialog(false)}
                              className="flex-1"
                            >
                              Hủy
                            </Button>
                            <Button
                              onClick={handleAddDiagnosis}
                              className="flex-1"
                            >
                              Lưu
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-4">
                    {selectedRecord.diagnoses.length > 0 ? (
                      selectedRecord.diagnoses
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        )
                        .map((diagnosis, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-foreground">
                                {diagnosis.diagnosis}
                              </h4>
                              <span className="text-xs text-muted-foreground">
                                {new Date(diagnosis.date).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {diagnosis.treatment}
                            </p>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Chưa có chẩn đoán
                      </p>
                    )}
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Chọn một bệnh nhân từ danh sách để xem chi tiết hồ sơ bệnh
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
