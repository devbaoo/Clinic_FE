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
} from "@/components/ui/dialog";
import { useState } from "react";
import {
  Search,
  Calendar,
  Clock,
  User,
  FileText,
  Eye,
  Download,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VisitHistory {
  id: number;
  patientName: string;
  patientId: string;
  date: string;
  time: string;
  doctor: string;
  room: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  medicines: string[];
  notes: string;
  status: "Hoàn thành" | "Hủy";
}

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedVisit, setSelectedVisit] = useState<VisitHistory | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  const [history, setHistory] = useState<VisitHistory[]>([
    {
      id: 1,
      patientName: "Nguyễn Văn A",
      patientId: "123456789",
      date: "2025-01-20",
      time: "09:00",
      doctor: "Bác sĩ Trần Minh",
      room: "P101",
      diagnosis: "Cảm cúm",
      symptoms: "Sốt, ho, đau họng, mệt mỏi",
      treatment: "Nghỉ ngơi, uống nước ấm, kiểm soát sốt",
      medicines: ["Paracetamol 500mg", "Vitamin C 1000mg"],
      notes: "Bệnh nhân sốt cao, được kê đơn hạ sốt và vitamin",
      status: "Hoàn thành",
    },
    {
      id: 2,
      patientName: "Trần Thị B",
      patientId: "987654321",
      date: "2025-01-18",
      time: "14:30",
      doctor: "Bác sĩ Nguyễn Hòa",
      room: "P102",
      diagnosis: "Viêm họng",
      symptoms: "Đau họng, khó nuốt",
      treatment: "Kỵ thuốc kháng sinh, súc miệng nước muối",
      medicines: ["Amoxicillin 500mg"],
      notes: "Viêm họng do vi khuẩn, cần uống đầy đủ thuốc",
      status: "Hoàn thành",
    },
    {
      id: 3,
      patientName: "Phạm Văn C",
      patientId: "456789123",
      date: "2025-01-15",
      time: "10:00",
      doctor: "Bác sĩ Lê Hải",
      room: "P101",
      diagnosis: "Tăng huyết áp",
      symptoms: "Đau đầu, chóng mặt",
      treatment: "Kiểm soát chế độ ăn, tập luyện, dùng thuốc huyết áp",
      medicines: ["Amlodipine 5mg", "Metoprolol 50mg"],
      notes: "Bệnh nhân cần theo dõi huyết áp hàng ngày",
      status: "Hoàn thành",
    },
    {
      id: 4,
      patientName: "Lê Thị D",
      patientId: "789123456",
      date: "2025-01-12",
      time: "15:00",
      doctor: "Bác sĩ Trần Minh",
      room: "P103",
      diagnosis: "Khám sức khỏe định kỳ",
      symptoms: "Không",
      treatment: "Kiểm tra toàn thân, xét nghiệm máu",
      medicines: [],
      notes: "Bệnh nhân khỏe mạnh, tiếp tục theo dõi định kỳ",
      status: "Hoàn thành",
    },
    {
      id: 5,
      patientName: "Hoàng Văn E",
      patientId: "123789456",
      date: "2025-01-08",
      time: "11:30",
      doctor: "Bác sĩ Nguyễn Hòa",
      room: "P102",
      diagnosis: "Đau dạ dày",
      symptoms: "Đau vùng bụng trên, ợ chua, khó tiêu",
      treatment: "Thay đổi chế độ ăn, dùng thuốc tiêu hóa",
      medicines: ["Omeprazole 20mg", "Antacid"],
      notes: "Có liên quan đến chế độ ăn không lành mạnh",
      status: "Hoàn thành",
    },
    {
      id: 6,
      patientName: "Trần Thị B",
      patientId: "987654321",
      date: "2025-01-05",
      time: "09:30",
      doctor: "Bác sĩ Lê Hải",
      room: "P101",
      diagnosis: "Tái khám hen suyễn",
      symptoms: "Khó thở khi hoạt động, ho về đêm",
      treatment: "Điều chỉnh liều thuốc hen, tập luyện hô hấp",
      medicines: ["Salbutamol inhaler", "Fluticasone inhaler"],
      notes: "Bệnh nhân cải thiện, tiếp tục sử dụng inhaler",
      status: "Hoàn thành",
    },
  ]);

  const filteredHistory = history.filter(
    (visit) =>
      (visit.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.patientId.includes(searchTerm)) &&
      (dateFilter === "" || visit.date.startsWith(dateFilter))
  );

  const groupedHistory = filteredHistory.reduce(
    (acc, visit) => {
      const month = visit.date.substring(0, 7);
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(visit);
      return acc;
    },
    {} as Record<string, VisitHistory[]>
  );

  const sortedMonths = Object.keys(groupedHistory).sort().reverse();

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Lịch sử khám</h1>
          <p className="text-muted-foreground">
            Xem lịch sử khám bệnh và điều trị của các bệnh nhân
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên bệnh nhân hoặc số CMND..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Input
            type="month"
            placeholder="Lọc theo tháng"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-48"
          />
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Tổng lần khám</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {filteredHistory.length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Bệnh nhân duy nhất</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {new Set(filteredHistory.map((v) => v.patientId)).size}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Bác sĩ tham gia</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {new Set(filteredHistory.map((v) => v.doctor)).size}
            </p>
          </Card>
        </div>

        {/* History Timeline */}
        <div className="space-y-8">
          {sortedMonths.length > 0 ? (
            sortedMonths.map((month) => (
              <div key={month}>
                {/* Month Header */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    {new Date(month + "-01").toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                    })}
                  </h2>
                </div>

                {/* Month Visits */}
                <div className="space-y-3">
                  {groupedHistory[month]
                    .sort(
                      (a, b) =>
                        new Date(b.date + " " + b.time).getTime() -
                        new Date(a.date + " " + a.time).getTime()
                    )
                    .map((visit) => (
                      <Card
                        key={visit.id}
                        className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => {
                          setSelectedVisit(visit);
                          setOpenDetailDialog(true);
                        }}
                      >
                        <div className="grid gap-6 md:grid-cols-2">
                          {/* Left Column */}
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">
                                {visit.patientName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                CMND: {visit.patientId}
                              </p>
                            </div>

                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {new Date(visit.date).toLocaleDateString(
                                  "vi-VN"
                                )}
                                {" - "}
                                <Clock className="h-4 w-4 ml-2" />
                                {visit.time}
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4" />
                                {visit.doctor}
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                Phòng {visit.room}
                              </div>
                            </div>
                          </div>

                          {/* Right Column */}
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-muted-foreground uppercase">
                                Chẩn đoán
                              </p>
                              <p className="font-medium text-foreground">
                                {visit.diagnosis}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-muted-foreground uppercase">
                                Triệu chứng
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {visit.symptoms}
                              </p>
                            </div>

                            {visit.medicines.length > 0 && (
                              <div>
                                <p className="text-xs text-muted-foreground uppercase">
                                  Thuốc
                                </p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {visit.medicines.map((medicine, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                    >
                                      {medicine}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVisit(visit);
                              setOpenDetailDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Chi tiết
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Tải báo cáo
                          </Button>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            ))
          ) : (
            <Card className="p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">
                Không tìm thấy lịch sử khám bệnh
              </p>
            </Card>
          )}
        </div>

        {/* Detail Dialog */}
        <Dialog open={openDetailDialog} onOpenChange={setOpenDetailDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết lần khám</DialogTitle>
              <DialogDescription>
                Thông tin chi tiết về buổi khám bệnh
              </DialogDescription>
            </DialogHeader>

            {selectedVisit && (
              <div className="space-y-6 py-4">
                {/* Patient & Visit Info */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Thông tin bệnh nhân và lần khám
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tên</p>
                      <p className="font-medium text-foreground">
                        {selectedVisit.patientName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CMND</p>
                      <p className="font-medium text-foreground">
                        {selectedVisit.patientId}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày khám</p>
                      <p className="font-medium text-foreground">
                        {new Date(selectedVisit.date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Giờ khám</p>
                      <p className="font-medium text-foreground">
                        {selectedVisit.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bác sĩ</p>
                      <p className="font-medium text-foreground">
                        {selectedVisit.doctor}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phòng</p>
                      <p className="font-medium text-foreground">
                        {selectedVisit.room}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Medical Info */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Thông tin y tế
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Triệu chứng</p>
                      <p className="text-foreground">{selectedVisit.symptoms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Chẩn đoán</p>
                      <p className="text-foreground">{selectedVisit.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Điều trị</p>
                      <p className="text-foreground">{selectedVisit.treatment}</p>
                    </div>
                  </div>
                </div>

                {/* Medicines */}
                {selectedVisit.medicines.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">
                      Thuốc được kê đơn
                    </h3>
                    <div className="space-y-2">
                      {selectedVisit.medicines.map((medicine, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-2 rounded-lg border border-border text-foreground"
                        >
                          {medicine}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedVisit.notes && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Ghi chú bác sĩ
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedVisit.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
