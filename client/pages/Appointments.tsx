import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetAppointmentsQuery,
  useGetDoctorsQuery,
  useUpdateAppointmentStatusMutation
} from '@/lib/redux/api/apiSlice';
import { Appointment } from '@shared/api';
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
  Calendar,
  Search,
  Plus,
  Filter,
  Calendar as CalendarIcon,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Fetch appointments
  const {
    data: appointmentsData,
    isLoading,
    error
  } = useGetAppointmentsQuery({ page, limit, status });

  // Fetch doctors for filtering
  const { data: doctors } = useGetDoctorsQuery();

  // Update appointment status
  const [updateAppointmentStatus] = useUpdateAppointmentStatusMutation();

  // Handle status change
  const handleStatusChange = async (appointmentId: string, newStatus: Appointment['status']) => {
    try {
      await updateAppointmentStatus({
        id: appointmentId,
        statusData: { status: newStatus }
      }).unwrap();
    } catch (error) {
      console.error('Failed to update appointment status:', error);
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
  };

  // Format time
  const formatTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'HH:mm', { locale: vi });
  };

  // Filter by date
  const handleDateFilter = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    // Implement date filtering logic
  };

  // Get status badge color
  const getStatusBadgeColor = (status: Appointment['status']) => {
    switch (status) {
      case 'Đã hoàn thành':
        return 'bg-green-100 text-green-800';
      case 'Đang khám':
        return 'bg-blue-100 text-blue-800';
      case 'Đã xác nhận':
        return 'bg-purple-100 text-purple-800';
      case 'Hủy':
        return 'bg-red-100 text-red-800';
      case 'Chờ':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>
          {/* @ts-ignore */}
          {error?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu lịch hẹn. Vui lòng thử lại sau.'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý lịch hẹn</h2>
        <Button onClick={() => navigate('/appointments/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Đặt lịch hẹn mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách lịch hẹn</CardTitle>
              <CardDescription>
                Quản lý tất cả các lịch hẹn khám bệnh
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
                    <SelectItem value="Đã xác nhận">Đã xác nhận</SelectItem>
                    <SelectItem value="Chờ">Chờ</SelectItem>
                    <SelectItem value="Đang khám">Đang khám</SelectItem>
                    <SelectItem value="Đã hoàn thành">Đã hoàn thành</SelectItem>
                    <SelectItem value="Hủy">Hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[180px] justify-start text-left font-normal"
                    >
                      {date ? (
                        format(date, "dd/MM/yyyy", { locale: vi })
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={handleDateFilter}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
          ) : appointmentsData && appointmentsData.appointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Giờ</TableHead>
                  <TableHead>Bệnh nhân</TableHead>
                  <TableHead>Bác sĩ</TableHead>
                  <TableHead>Lý do khám</TableHead>
                  <TableHead>Phòng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointmentsData.appointments.map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell>{formatDate(appointment.date)}</TableCell>
                    <TableCell>{formatTime(appointment.date)}</TableCell>
                    <TableCell className="font-medium">
                      {appointment.patientId.name}
                    </TableCell>
                    <TableCell>{appointment.doctorId.fullName}</TableCell>
                    <TableCell>{appointment.reason}</TableCell>
                    <TableCell>{appointment.room}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Filter className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/appointments/${appointment._id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(appointment._id, 'Đã xác nhận')}>
                              Đã xác nhận
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(appointment._id, 'Đang khám')}>
                              Đang khám
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(appointment._id, 'Đã hoàn thành')}>
                              Đã hoàn thành
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(appointment._id, 'Hủy')}>
                              Hủy
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
              <Calendar className="h-10 w-10 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">Không có lịch hẹn nào</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/appointments/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Đặt lịch hẹn mới
              </Button>
            </div>
          )}

          {appointmentsData && appointmentsData.totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(Math.max(1, page - 1))}
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {[...Array(appointmentsData.totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  // Show current page, first, last, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === appointmentsData.totalPages ||
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
                  if (pageNumber === 2 || pageNumber === appointmentsData.totalPages - 1) {
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
                    onClick={() => setPage(Math.min(appointmentsData.totalPages, page + 1))}
                    className={page === appointmentsData.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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

export default Appointments;