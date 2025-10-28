import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/services/store/store';
import { selectPatients, selectAppointments, selectPrescriptions } from '@/services/features/apiSlice';
import { Patient } from '@shared/api';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, FileText, User, Phone, Mail, MapPin } from 'lucide-react';

const PatientDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const patients = useAppSelector(selectPatients);
    const appointments = useAppSelector(selectAppointments);
    const prescriptions = useAppSelector(selectPrescriptions);

    const patient = patients.find(p => p.id === id);
    const patientAppointments = appointments.filter(a => a.patientId === id);
    const patientPrescriptions = prescriptions.filter(p => p.patientId === id);

    const [status, setStatus] = useState(patient?.status || 'active');

    if (!patient) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/patients')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight">Không tìm thấy bệnh nhân</h2>
                </div>
                <Card>
                    <CardContent className="text-center py-8">
                        Bệnh nhân không tồn tại hoặc đã bị xóa
                    </CardContent>
                </Card>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusColor = (status: Patient['status']) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-yellow-100 text-yellow-800';
            case 'discharged':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: Patient['status']) => {
        switch (status) {
            case 'active':
                return 'Hoạt động';
            case 'inactive':
                return 'Tạm dừng';
            case 'discharged':
                return 'Đã xuất viện';
            default:
                return status;
        }
    };

    const getGenderText = (gender: Patient['gender']) => {
        switch (gender) {
            case 'male':
                return 'Nam';
            case 'female':
                return 'Nữ';
            case 'other':
                return 'Khác';
            default:
                return gender;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/patients')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">
                    {patient.firstName} {patient.lastName}
                </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Patient Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Thông tin bệnh nhân
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Họ tên</label>
                                <p className="text-sm">{patient.firstName} {patient.lastName}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Giới tính</label>
                                <p className="text-sm">{getGenderText(patient.gender)}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Ngày sinh</label>
                                <p className="text-sm">{formatDate(patient.dateOfBirth)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                                <Badge className={getStatusColor(patient.status)}>
                                    {getStatusText(patient.status)}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                Số điện thoại
                            </label>
                            <p className="text-sm">{patient.phone}</p>
                        </div>
                        {patient.email && (
                            <div>
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </label>
                                <p className="text-sm">{patient.email}</p>
                            </div>
                        )}
                        {patient.address && (
                            <div>
                                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    Địa chỉ
                                </label>
                                <p className="text-sm">{patient.address}</p>
                            </div>
                        )}
                        {patient.emergencyContact && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Liên hệ khẩn cấp</label>
                                <p className="text-sm">{patient.emergencyContact}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Medical Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin y tế</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {patient.medicalHistory && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Tiền sử bệnh</label>
                                <p className="text-sm">{patient.medicalHistory}</p>
                            </div>
                        )}
                        {patient.allergies && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Dị ứng</label>
                                <p className="text-sm">{patient.allergies}</p>
                            </div>
                        )}
                        <div>
                            <label className="text-sm font-medium text-gray-500">Ngày tạo hồ sơ</label>
                            <p className="text-sm">{formatDate(patient.createdAt)}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Cập nhật lần cuối</label>
                            <p className="text-sm">{formatDate(patient.updatedAt)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs for Appointments and Prescriptions */}
            <Tabs defaultValue="appointments" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="appointments" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Lịch hẹn ({patientAppointments.length})
                    </TabsTrigger>
                    <TabsTrigger value="prescriptions" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Đơn thuốc ({patientPrescriptions.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="appointments" className="space-y-4">
                    {patientAppointments.length > 0 ? (
                        patientAppointments.map((appointment) => (
                            <Card key={appointment.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        {formatDate(appointment.appointmentDate)} - {appointment.appointmentTime}
                                    </CardTitle>
                                    <CardDescription>
                                        Loại: {appointment.type} | Trạng thái: {appointment.status}
                                    </CardDescription>
                                </CardHeader>
                                {appointment.notes && (
                                    <CardContent>
                                        <p className="text-sm">{appointment.notes}</p>
                                    </CardContent>
                                )}
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="text-center py-8">
                                Không có lịch hẹn nào
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="prescriptions" className="space-y-4">
                    {patientPrescriptions.length > 0 ? (
                        patientPrescriptions.map((prescription) => (
                            <Card key={prescription.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Đơn thuốc #{prescription.id.slice(-6)}
                                    </CardTitle>
                                    <CardDescription>
                                        Ngày: {formatDate(prescription.prescriptionDate)} | Trạng thái: {prescription.status}
                                    </CardDescription>
                                </CardHeader>
                                {prescription.notes && (
                                    <CardContent>
                                        <p className="text-sm">{prescription.notes}</p>
                                    </CardContent>
                                )}
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="text-center py-8">
                                Không có đơn thuốc nào
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PatientDetail;