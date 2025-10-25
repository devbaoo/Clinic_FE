import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetPrescriptionsQuery,
  useUpdatePrescriptionStatusMutation
} from '@/lib/redux/api/apiSlice';
import { Prescription } from '@shared/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FileText,
  Search,
  Plus,
  Filter,
  Calendar,
  FileCheck,
  FilePlus,
  Download,
  Printer,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Prescriptions: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState<string | undefined>(undefined);

  // Fetch prescriptions
  const {
    data: prescriptionsData,
    isLoading,
    error
  } = useGetPrescriptionsQuery({ page, limit, status });

  // Update prescription status
  const [updatePrescriptionStatus] = useUpdatePrescriptionStatusMutation();

  // Handle status change
  const handleStatusChange = async (prescriptionId: string, newStatus: Prescription['status']) => {
    try {
      await updatePrescriptionStatus({
        id: prescriptionId,
        statusData: { status: newStatus }
      }).unwrap();
    } catch (error) {
      console.error('Failed to update prescription status:', error);
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
  };

  // Get status badge color
  const getStatusBadgeColor = (status: Prescription['status']) => {
    switch (status) {
      case 'Đã phát hành':
        return 'bg-green-100 text-green-800';
      case 'Đã duyệt':
        return 'bg-blue-100 text-blue-800';
      case 'Hủy':
        return 'bg-red-100 text-red-800';
      case 'Chưa duyệt':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>
          {/* @ts-ignore */}
          {error?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu đơn thuốc. Vui lòng thử lại sau.'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý đơn thuốc</h2>
        <Button onClick={() => navigate('/prescriptions/new')}>
          <FilePlus className="mr-2 h-4 w-4" />
          Tạo đơn thuốc mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách đơn thuốc</CardTitle>
              <CardDescription>
                Quản lý tất cả các đơn thuốc trong hệ thống
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Tìm kiếm..."
                  className="w-[200px]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined as any}>Tất cả</SelectItem>
                    <SelectItem value="Chưa duyệt">Chưa duyệt</SelectItem>
                    <SelectItem value="Đã duyệt">Đã duyệt</SelectItem>
                    <SelectItem value="Đã phát hành">Đã phát hành</SelectItem>
                    <SelectItem value="Hủy">Hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : prescriptionsData && prescriptionsData.prescriptions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Bệnh nhân</TableHead>
                  <TableHead>Bác sĩ</TableHead>
                  <TableHead>Số lượng thuốc</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptionsData.prescriptions.map((prescription) => (
                  <TableRow key={prescription._id}>
                    <TableCell className="font-medium">
                      #{prescription._id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>{formatDate(prescription.date)}</TableCell>
                    <TableCell>
                      {prescription.patientId.name}
                    </TableCell>
                    <TableCell>{prescription.doctorId.fullName}</TableCell>
                    <TableCell>{prescription.itemCount || 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(prescription.status)}`}>
                        {prescription.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/prescriptions/${prescription._id}`)}>
                              <FileCheck className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(prescription._id, 'Đã duyệt')}>
                              Duyệt đơn thuốc
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(prescription._id, 'Đã phát hành')}>
                              Phát hành đơn thuốc
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(prescription._id, 'Hủy')}>
                              Hủy đơn thuốc
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" />
                              In đơn thuốc
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Tải xuống PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <FileText className="h-10 w-10 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">Không có đơn thuốc nào</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/prescriptions/new')}
              >
                <FilePlus className="mr-2 h-4 w-4" />
                Tạo đơn thuốc mới
              </Button>
            </div>
          )}

          {prescriptionsData && prescriptionsData.totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(Math.max(1, page - 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {[...Array(prescriptionsData.totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  // Show current page, first, last, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === prescriptionsData.totalPages ||
                    (pageNumber >= page - 1 && pageNumber <= page + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          isActive={page === pageNumber}
                          onClick={() => setPage(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  // Show ellipsis for gaps
                  if (pageNumber === 2 || pageNumber === prescriptionsData.totalPages - 1) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <span className="px-4">...</span>
                      </PaginationItem>
                    );
                  }

                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(Math.min(prescriptionsData.totalPages, page + 1))}
                    className={page === prescriptionsData.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Prescriptions;