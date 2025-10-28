import React, { useState } from 'react';
import { useAppSelector } from '@/services/store/store';
import { selectUsers } from '@/services/features/apiSlice';
import { User } from '@shared/api';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Users } from 'lucide-react';

const UserManagement: React.FC = () => {
    const users = useAppSelector(selectUsers);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);

    // Filter users based on search term and role
    const filteredUsers = users.filter(user => {
        const matchesSearch = !searchTerm ||
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = !roleFilter || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    const getRoleText = (role: User['role']) => {
        switch (role) {
            case 'admin':
                return 'Quản trị viên';
            case 'doctor':
                return 'Bác sĩ';
            case 'nurse':
                return 'Y tá';
            case 'receptionist':
                return 'Lễ tân';
            default:
                return role;
        }
    };

    const getStatusText = (isActive: boolean) => {
        return isActive ? 'Hoạt động' : 'Tạm dừng';
    };

    const getStatusColor = (isActive: boolean) => {
        return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h2>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm người dùng
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Thêm người dùng mới</DialogTitle>
                            <DialogDescription>
                                Tạo tài khoản người dùng mới trong hệ thống
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName">Họ</Label>
                                    <Input id="firstName" placeholder="Nhập họ" />
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Tên</Label>
                                    <Input id="lastName" placeholder="Nhập tên" />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="Nhập email" />
                            </div>
                            <div>
                                <Label htmlFor="role">Vai trò</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn vai trò" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Quản trị viên</SelectItem>
                                        <SelectItem value="doctor">Bác sĩ</SelectItem>
                                        <SelectItem value="nurse">Y tá</SelectItem>
                                        <SelectItem value="receptionist">Lễ tân</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Hủy
                            </Button>
                            <Button onClick={() => setIsAddDialogOpen(false)}>
                                Thêm người dùng
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-96">
                    <Input
                        placeholder="Tìm kiếm người dùng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Select value={roleFilter || 'all'} onValueChange={(value) => setRoleFilter(value === 'all' ? undefined : value)}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="admin">Quản trị viên</SelectItem>
                        <SelectItem value="doctor">Bác sĩ</SelectItem>
                        <SelectItem value="nurse">Y tá</SelectItem>
                        <SelectItem value="receptionist">Lễ tân</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{filteredUsers.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Tổng số người dùng trong hệ thống
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Họ tên</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Vai trò</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="hidden md:table-cell">Ngày tạo</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.firstName} {user.lastName}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{getRoleText(user.role)}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isActive)}`}>
                                            {getStatusText(user.isActive)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {formatDate(user.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsEditDialogOpen(true);
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    // Handle delete
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    Không tìm thấy người dùng nào
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {filteredUsers.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Hiển thị {filteredUsers.length} người dùng
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;