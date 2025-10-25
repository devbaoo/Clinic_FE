import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    useGetPatientByIdQuery,
    useGetMedicalRecordByPatientIdQuery,
    useGetDiagnosesByPatientIdQuery,
    useGetAppointmentsByPatientIdQuery,
    useGetPrescriptionsByPatientIdQuery,
    useUpdatePatientStatusMutation
} from '@/lib/redux/api/apiSlice';
import { Patient, UpdatePatientStatusRequest } from '@shared/api';
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
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Calendar,
    FileText,
    Stethoscope,
    User,
    Phone,
    Mail,
    MapPin,
    Calendar as CalendarIcon,
    FileCheck,
    ArrowLeft
} from 'lucide-react';

const PatientDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');

    // Fetch patient data
    const {
        data: patient,
        isLoading: isLoadingPatient,
        error: patientError
    } = useGetPatientByIdQuery(id!);

    // Fetch medical record
    const {
        data: medicalRecord,
        isLoading: isLoadingMedicalRecord
    } = useGetMedicalRecordByPatientIdQuery(id!, { skip: !id });

    // Fetch diagnoses with pagination
    const [diagnosisPage, setDiagnosisPage] = useState(1);
    const {
        data: diagnosesData,
        isLoading: isLoadingDiagnoses
    } = useGetDiagnosesByPatientIdQuery({
        patientId: id!,
        page: diagnosisPage,
        limit: 5
    }, { skip: !id });

    // Fetch appointments with pagination
    const [appointmentPage, setAppointmentPage] = useState(1);
    const {
        data: appointmentsData,
        isLoading: isLoadingAppointments
    } = useGetAppointmentsByPatientIdQuery({
        patientId: id!,
        page: appointmentPage,
        limit: 5
    }, { skip: !id });

    // Fetch prescriptions with pagination
    const [prescriptionPage, setPrescriptionPage] = useState(1);
    const {
        data: prescriptionsData,
        isLoading: isLoadingPrescriptions
    } = useGetPrescriptionsByPatientIdQuery({
        patientId: id!,
        page: prescriptionPage,
        limit: 5
    }, { skip: !id });

    // Update patient status mutation
    const [updatePatientStatus] = useUpdatePatientStatusMutation();

    const handleStatusChange = async (value: string) => {
        if (!id || !value) return;

        try {
            const statusData: UpdatePatientStatusRequest = {
                status: value as Patient['status']
            };
            await updatePatientStatus({ id, statusData }).unwrap();
        } catch (error) {
            console.error('Failed to update patient status:', error);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusColor = (status: Patient['status']) => {
        switch (status) {
            case 'Hoạt động':
                return 'bg-green-100 text-green-800';
            case 'Tạm dừng':
                return 'bg-yellow-100 text-yellow-800';
            case 'Mới':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoadingPatient) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/patients')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại
                    </Button>
                    <Skeleton className="h-8 w-64" />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-[300px] w-full" />
                    <Skeleton className="h-[300px] w-full" />
                </div>
            </div>
        );
    }

    if (patientError) {
        return (
            <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                    {/* @ts-ignore */}
                    {patientError?.data?.message || 'Không thể tải thông tin bệnh nhân. Vui lòng thử lại sau.'}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/patients')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight">Hồ sơ bệnh nhân</h2>
                </div>

                <div className="flex items-center gap-4">
                    <Select
                        value={patient?.status}
                        onValueChange={handleStatusChange}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Hoạt động">Hoạt động</SelectItem>
                            <SelectItem value="Tạm dừng">Tạm dừng</SelectItem>
                            <SelectItem value="Mới">Mới</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={() => navigate(`/patients/edit/${id}`)}>
                        Chỉnh sửa
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Patient info card */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Thông tin bệnh nhân</CardTitle>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient?.status || 'Mới')}`}>
                                {patient?.status}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <User className="h-5 w-5 mr-2 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Họ tên</p>
                                    <p className="font-medium">{patient?.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Phone className="h-5 w-5 mr-2 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Số điện thoại</p>
                                    <p className="font-medium">{patient?.phone || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Mail className="h-5 w-5 mr-2 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{patient?.email || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Ngày sinh</p>
                                    <p className="font-medium">{formatDate(patient?.dob)}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Địa chỉ</p>
                                    <p className="font-medium">{patient?.address || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main content tabs */}
                <div className="md:col-span-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-4 mb-4">
                            <TabsTrigger value="info">
                                <User className="h-4 w-4 mr-2" />
                                Hồ sơ y tế
                            </TabsTrigger>
                            <TabsTrigger value="diagnoses">
                                <Stethoscope className="h-4 w-4 mr-2" />
                                Chẩn đoán
                            </TabsTrigger>
                            <TabsTrigger value="appointments">
                                <Calendar className="h-4 w-4 mr-2" />
                                Lịch hẹn
                            </TabsTrigger>
                            <TabsTrigger value="prescriptions">
                                <FileText className="h-4 w-4 mr-2" />
                                Đơn thuốc
                            </TabsTrigger>
                        </TabsList>

                        {/* Medical Record Tab */}
                        <TabsContent value="info">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Hồ sơ y tế</CardTitle>
                                    <CardDescription>
                                        Thông tin sức khỏe và tiền sử bệnh của bệnh nhân
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isLoadingMedicalRecord ? (
                                        <div className="space-y-4">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                    ) : medicalRecord ? (
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium">Nhóm máu</h4>
                                                <p>{medicalRecord.bloodType || 'Chưa có thông tin'}</p>
                                            </div>

                                            <div>
                                                <h4 className="font-medium">Dị ứng</h4>
                                                <p>{medicalRecord.allergies || 'Không có dị ứng'}</p>
                                            </div>

                                            <div>
                                                <h4 className="font-medium">Bệnh nền</h4>
                                                <p>{medicalRecord.chronicDiseases || 'Không có bệnh nền'}</p>
                                            </div>

                                            <div>
                                                <h4 className="font-medium">Tiền sử phẫu thuật</h4>
                                                <p>{medicalRecord.surgicalHistory || 'Không có tiền sử phẫu thuật'}</p>
                                            </div>

                                            <div>
                                                <h4 className="font-medium">Tiền sử gia đình</h4>
                                                <p>{medicalRecord.familyHistory || 'Không có thông tin'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-center py-4">Chưa có hồ sơ y tế</p>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate(`/medical-records/${id}`)}
                                        disabled={isLoadingMedicalRecord}
                                    >
                                        {medicalRecord ? 'Cập nhật hồ sơ y tế' : 'Tạo hồ sơ y tế'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Diagnoses Tab */}
                        <TabsContent value="diagnoses">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Lịch sử chẩn đoán</CardTitle>
                                        <CardDescription>
                                            Các lần chẩn đoán và kết quả khám bệnh
                                        </CardDescription>
                                    </div>
                                    <Button onClick={() => navigate(`/diagnoses/new?patientId=${id}`)}>
                                        Thêm chẩn đoán
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {isLoadingDiagnoses ? (
                                        <div className="space-y-4">
                                            {[...Array(3)].map((_, i) => (
                                                <Skeleton key={i} className="h-16 w-full" />
                                            ))}
                                        </div>
                                    ) : diagnosesData && diagnosesData.diagnoses.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Ngày</TableHead>
                                                    <TableHead>Chẩn đoán</TableHead>
                                                    <TableHead>Bác sĩ</TableHead>
                                                    <TableHead className="text-right">Thao tác</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {diagnosesData.diagnoses.map((diagnosis) => (
                                                    <TableRow key={diagnosis._id}>
                                                        <TableCell>{formatDate(diagnosis.date)}</TableCell>
                                                        <TableCell>{diagnosis.diagnosis}</TableCell>
                                                        <TableCell>{diagnosis.doctorId.fullName}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => navigate(`/diagnoses/${diagnosis._id}`)}
                                                            >
                                                                Chi tiết
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <p className="text-center py-4">Chưa có chẩn đoán nào</p>
                                    )}
                                </CardContent>
                                {diagnosesData && diagnosesData.totalPages > 1 && (
                                    <CardFooter className="flex justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={() => setDiagnosisPage(Math.max(1, diagnosisPage - 1))}
                                            disabled={diagnosisPage === 1}
                                        >
                                            Trước
                                        </Button>
                                        <div className="text-sm text-gray-500">
                                            Trang {diagnosisPage} / {diagnosesData.totalPages}
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => setDiagnosisPage(Math.min(diagnosesData.totalPages, diagnosisPage + 1))}
                                            disabled={diagnosisPage === diagnosesData.totalPages}
                                        >
                                            Sau
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        </TabsContent>

                        {/* Appointments Tab */}
                        <TabsContent value="appointments">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Lịch hẹn</CardTitle>
                                        <CardDescription>
                                            Lịch sử các cuộc hẹn khám bệnh
                                        </CardDescription>
                                    </div>
                                    <Button onClick={() => navigate(`/appointments/new?patientId=${id}`)}>
                                        Đặt lịch hẹn
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {isLoadingAppointments ? (
                                        <div className="space-y-4">
                                            {[...Array(3)].map((_, i) => (
                                                <Skeleton key={i} className="h-16 w-full" />
                                            ))}
                                        </div>
                                    ) : appointmentsData && appointmentsData.appointments.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Ngày</TableHead>
                                                    <TableHead>Lý do khám</TableHead>
                                                    <TableHead>Trạng thái</TableHead>
                                                    <TableHead className="text-right">Thao tác</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {appointmentsData.appointments.map((appointment) => (
                                                    <TableRow key={appointment._id}>
                                                        <TableCell>{formatDate(appointment.date)}</TableCell>
                                                        <TableCell>{appointment.reason}</TableCell>
                                                        <TableCell>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${appointment.status === 'Đã hoàn thành'
                                                                ? 'bg-green-100 text-green-800'
                                                                : appointment.status === 'Đang khám'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : appointment.status === 'Đã xác nhận'
                                                                        ? 'bg-purple-100 text-purple-800'
                                                                        : appointment.status === 'Hủy'
                                                                            ? 'bg-red-100 text-red-800'
                                                                            : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {appointment.status}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => navigate(`/appointments/${appointment._id}`)}
                                                            >
                                                                Chi tiết
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <p className="text-center py-4">Chưa có lịch hẹn nào</p>
                                    )}
                                </CardContent>
                                {appointmentsData && appointmentsData.totalPages > 1 && (
                                    <CardFooter className="flex justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={() => setAppointmentPage(Math.max(1, appointmentPage - 1))}
                                            disabled={appointmentPage === 1}
                                        >
                                            Trước
                                        </Button>
                                        <div className="text-sm text-gray-500">
                                            Trang {appointmentPage} / {appointmentsData.totalPages}
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => setAppointmentPage(Math.min(appointmentsData.totalPages, appointmentPage + 1))}
                                            disabled={appointmentPage === appointmentsData.totalPages}
                                        >
                                            Sau
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        </TabsContent>

                        {/* Prescriptions Tab */}
                        <TabsContent value="prescriptions">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Đơn thuốc</CardTitle>
                                        <CardDescription>
                                            Lịch sử kê đơn thuốc
                                        </CardDescription>
                                    </div>
                                    <Button onClick={() => navigate(`/prescriptions/new?patientId=${id}`)}>
                                        Kê đơn thuốc
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {isLoadingPrescriptions ? (
                                        <div className="space-y-4">
                                            {[...Array(3)].map((_, i) => (
                                                <Skeleton key={i} className="h-16 w-full" />
                                            ))}
                                        </div>
                                    ) : prescriptionsData && prescriptionsData.prescriptions.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Ngày</TableHead>
                                                    <TableHead>Bác sĩ</TableHead>
                                                    <TableHead>Trạng thái</TableHead>
                                                    <TableHead className="text-right">Thao tác</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {prescriptionsData.prescriptions.map((prescription) => (
                                                    <TableRow key={prescription._id}>
                                                        <TableCell>{formatDate(prescription.date)}</TableCell>
                                                        <TableCell>{prescription.doctorId.fullName}</TableCell>
                                                        <TableCell>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${prescription.status === 'Đã phát hành'
                                                                ? 'bg-green-100 text-green-800'
                                                                : prescription.status === 'Đã duyệt'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : prescription.status === 'Hủy'
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {prescription.status}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => navigate(`/prescriptions/${prescription._id}`)}
                                                            >
                                                                <FileCheck className="h-4 w-4 mr-1" />
                                                                Chi tiết
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <p className="text-center py-4">Chưa có đơn thuốc nào</p>
                                    )}
                                </CardContent>
                                {prescriptionsData && prescriptionsData.totalPages > 1 && (
                                    <CardFooter className="flex justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={() => setPrescriptionPage(Math.max(1, prescriptionPage - 1))}
                                            disabled={prescriptionPage === 1}
                                        >
                                            Trước
                                        </Button>
                                        <div className="text-sm text-gray-500">
                                            Trang {prescriptionPage} / {prescriptionsData.totalPages}
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => setPrescriptionPage(Math.min(prescriptionsData.totalPages, prescriptionPage + 1))}
                                            disabled={prescriptionPage === prescriptionsData.totalPages}
                                        >
                                            Sau
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default PatientDetail;
