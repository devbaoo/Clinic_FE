import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/services/store/store';
import { selectAppointments, selectUsers } from '@/services/features/apiSlice';
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
  SelectValue
} from '@/components/ui/select';
import { Calendar, Clock, User, Plus } from 'lucide-react';

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const appointments = useAppSelector(selectAppointments);
  const users = useAppSelector(selectUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  // Filter appointments based on search term and status
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = !searchTerm ||
      appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !status || appointment.status === status;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Đã lên lịch';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'in_progress':
        return 'Đang khám';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      case 'no_show':
        return 'Không đến';
      default:
        return status;
    }
  };

  const getTypeText = (type: Appointment['type']) => {
    switch (type) {
      case 'consultation':
        return 'Tư vấn';
      case 'follow-up':
        return 'Tái khám';
      case 'emergency':
        return 'Cấp cứu';
      case 'routine':
        return 'Khám định kỳ';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Danh sách lịch hẹn</h2>
        <Button onClick={() => navigate('/appointments/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Đặt lịch hẹn
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Input
            placeholder="Tìm kiếm lịch hẹn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={status || 'all'} onValueChange={(value) => setStatus(value === 'all' ? undefined : value)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="scheduled">Đã lên lịch</SelectItem>
            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
            <SelectItem value="in_progress">Đang khám</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
            <SelectItem value="no_show">Không đến</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {formatDate(appointment.appointmentDate)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4" />
                      {formatTime(appointment.appointmentTime)} - {appointment.duration} phút
                    </CardDescription>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Loại: {getTypeText(appointment.type)}
                    </span>
                  </div>
                  {appointment.notes && (
                    <div className="text-sm text-gray-600">
                      Ghi chú: {appointment.notes}
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/appointments/${appointment.id}`)}
                    >
                      Chi tiết
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              Không tìm thấy lịch hẹn nào
            </CardContent>
          </Card>
        )}
      </div>

      {filteredAppointments.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị {filteredAppointments.length} lịch hẹn
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;