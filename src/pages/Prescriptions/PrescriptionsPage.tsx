import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/services/store/store';
import { selectPrescriptions } from '@/services/features/apiSlice';
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
  SelectValue
} from '@/components/ui/select';
import { FileText, Plus, Calendar } from 'lucide-react';

const Prescriptions: React.FC = () => {
  const navigate = useNavigate();
  const prescriptions = useAppSelector(selectPrescriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);

  // Filter prescriptions based on search term and status
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = !searchTerm ||
      prescription.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !status || prescription.status === status;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status: Prescription['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'dispensed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Prescription['status']) => {
    switch (status) {
      case 'pending':
        return 'Chờ duyệt';
      case 'approved':
        return 'Đã duyệt';
      case 'dispensed':
        return 'Đã cấp thuốc';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Danh sách đơn thuốc</h2>
        <Button onClick={() => navigate('/prescriptions/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo đơn thuốc
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Input
            placeholder="Tìm kiếm đơn thuốc..."
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
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="dispensed">Đã cấp thuốc</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredPrescriptions.length > 0 ? (
          filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Đơn thuốc #{prescription.id.slice(-6)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(prescription.prescriptionDate)}
                    </CardDescription>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                    {getStatusText(prescription.status)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {prescription.notes && (
                    <div className="text-sm text-gray-600">
                      Ghi chú: {prescription.notes}
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/prescriptions/${prescription.id}`)}
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
              Không tìm thấy đơn thuốc nào
            </CardContent>
          </Card>
        )}
      </div>

      {filteredPrescriptions.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị {filteredPrescriptions.length} đơn thuốc
          </div>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;