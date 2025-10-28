import React from 'react';
import { useAppSelector } from '@/services/store/store';
import { selectStats } from '@/services/features/apiSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, CheckCircle, Clock, UserPlus } from 'lucide-react';

const Dashboard: React.FC = () => {
    const stats = useAppSelector(selectStats);

    const StatCard = ({ title, value, icon, description }: { title: string; value: number | string; icon: React.ReactNode; description: string }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Tổng quan</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Tổng số bệnh nhân"
                    value={stats?.totalPatients || 0}
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                    description="Tổng số bệnh nhân trong hệ thống"
                />

                <StatCard
                    title="Bệnh nhân mới"
                    value={1}
                    icon={<UserPlus className="h-4 w-4 text-muted-foreground" />}
                    description="Bệnh nhân mới trong tháng này"
                />

                <StatCard
                    title="Lịch hẹn hôm nay"
                    value={stats?.totalAppointments || 0}
                    icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                    description="Tổng số lịch hẹn trong ngày"
                />

                <StatCard
                    title="Lịch hẹn hoàn thành"
                    value={1}
                    icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
                    description="Số lịch hẹn đã hoàn thành"
                />

                <StatCard
                    title="Lịch hẹn đang chờ"
                    value={1}
                    icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                    description="Số lịch hẹn đang chờ xử lý"
                />
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Thống kê bệnh nhân</CardTitle>
                        <CardDescription>Phân bố bệnh nhân theo trạng thái</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span>Hoạt động</span>
                                <span className="font-medium">{stats?.totalPatients || 0}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-green-600 h-2.5 rounded-full"
                                    style={{ width: '100%' }}
                                ></div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span>Tạm dừng</span>
                                <span className="font-medium">0</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-yellow-500 h-2.5 rounded-full"
                                    style={{ width: '0%' }}
                                ></div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span>Mới</span>
                                <span className="font-medium">1</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: '50%' }}
                                ></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Thống kê lịch hẹn</CardTitle>
                        <CardDescription>Phân bố lịch hẹn theo trạng thái</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span>Hoàn thành</span>
                                <span className="font-medium">1</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-green-600 h-2.5 rounded-full"
                                    style={{ width: '50%' }}
                                ></div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span>Đang chờ</span>
                                <span className="font-medium">1</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: '50%' }}
                                ></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
