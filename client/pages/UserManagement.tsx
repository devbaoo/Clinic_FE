import React, { useState } from 'react';
import {
    useGetUsersQuery,
    useRegisterUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} from '@/lib/redux/api/apiSlice';
import { RegisterUserRequest, User } from '@shared/api';
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
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPlus, Pencil, Trash2, Search, UserCog } from 'lucide-react';

// Form validation schema
const userFormSchema = z.object({
    email: z.string().email({ message: "Email không hợp lệ" }),
    password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }).optional(),
    fullName: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
    role: z.enum(["admin", "doctor", "nurse", "staff"]),
    specialization: z.string().optional(),
    phone: z.string().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const UserManagement: React.FC = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [role, setRole] = useState<string | undefined>(undefined);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Fetch users
    const {
        data: usersData,
        isLoading,
        error,
        refetch
    } = useGetUsersQuery({ page, limit, role });

    // Mutations
    const [registerUser] = useRegisterUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    // Forms
    const addForm = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            email: "",
            password: "",
            fullName: "",
            role: "staff",
            specialization: "",
            phone: "",
        },
    });

    const editForm = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema.omit({ password: true })),
        defaultValues: {
            email: "",
            fullName: "",
            role: "staff",
            specialization: "",
            phone: "",
        },
    });

    // Handle form submissions
    const handleAddUser = async (data: UserFormValues) => {
        try {
            const userData: RegisterUserRequest = {
                email: data.email,
                password: data.password!,
                fullName: data.fullName,
                role: data.role,
                specialization: data.specialization,
                phone: data.phone,
            };

            await registerUser(userData).unwrap();
            setIsAddDialogOpen(false);
            addForm.reset();
            refetch();
        } catch (error) {
            console.error('Failed to add user:', error);
        }
    };

    const handleEditUser = async (data: UserFormValues) => {
        if (!selectedUser) return;

        try {
            const userData: Partial<RegisterUserRequest> = {
                email: data.email,
                fullName: data.fullName,
                role: data.role,
                specialization: data.specialization,
                phone: data.phone,
            };

            await updateUser({ id: selectedUser._id, userData }).unwrap();
            setIsEditDialogOpen(false);
            editForm.reset();
            refetch();
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        try {
            await deleteUser(selectedUser._id).unwrap();
            setIsDeleteDialogOpen(false);
            refetch();
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    // Open edit dialog with user data
    const openEditDialog = (user: User) => {
        setSelectedUser(user);
        editForm.reset({
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            specialization: user.specialization || "",
            phone: user.phone || "",
        });
        setIsEditDialogOpen(true);
    };

    // Open delete dialog
    const openDeleteDialog = (user: User) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    // Filter by role
    const handleRoleFilter = (selectedRole: string | undefined) => {
        setRole(selectedRole);
        setPage(1);
    };

    // Get role badge color
    const getRoleBadgeColor = (role: User['role']) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'doctor':
                return 'bg-blue-100 text-blue-800';
            case 'nurse':
                return 'bg-green-100 text-green-800';
            case 'staff':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Render role in Vietnamese
    const renderRole = (role: User['role']) => {
        switch (role) {
            case 'admin':
                return 'Quản trị viên';
            case 'doctor':
                return 'Bác sĩ';
            case 'nurse':
                return 'Y tá';
            case 'staff':
                return 'Nhân viên';
            default:
                return role;
        }
    };

    if (error) {
        return (
            <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                    {/* @ts-ignore */}
                    {error?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu người dùng. Vui lòng thử lại sau.'}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h2>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Thêm người dùng
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Thêm người dùng mới</DialogTitle>
                            <DialogDescription>
                                Nhập thông tin để tạo tài khoản người dùng mới.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...addForm}>
                            <form onSubmit={addForm.handleSubmit(handleAddUser)} className="space-y-4">
                                <FormField
                                    control={addForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="email@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={addForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mật khẩu</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="******" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={addForm.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Họ tên</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nguyễn Văn A" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={addForm.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Vai trò</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn vai trò" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="admin">Quản trị viên</SelectItem>
                                                    <SelectItem value="doctor">Bác sĩ</SelectItem>
                                                    <SelectItem value="nurse">Y tá</SelectItem>
                                                    <SelectItem value="staff">Nhân viên</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={addForm.control}
                                    name="specialization"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Chuyên khoa (chỉ cho bác sĩ)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nội khoa, Ngoại khoa, ..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={addForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Số điện thoại</FormLabel>
                                            <FormControl>
                                                <Input placeholder="0123456789" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit">Thêm người dùng</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Danh sách người dùng</CardTitle>
                            <CardDescription>
                                Quản lý tất cả người dùng trong hệ thống
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Search className="h-4 w-4 text-gray-500" />
                                <Select value={role} onValueChange={handleRoleFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Lọc theo vai trò" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={undefined as any}>Tất cả</SelectItem>
                                        <SelectItem value="admin">Quản trị viên</SelectItem>
                                        <SelectItem value="doctor">Bác sĩ</SelectItem>
                                        <SelectItem value="nurse">Y tá</SelectItem>
                                        <SelectItem value="staff">Nhân viên</SelectItem>
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
                    ) : usersData && usersData.users.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Họ tên</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Vai trò</TableHead>
                                    <TableHead>Số điện thoại</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {usersData.users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell className="font-medium">{user.fullName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                {renderRole(user.role)}
                                            </span>
                                        </TableCell>
                                        <TableCell>{user.phone || 'N/A'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEditDialog(user)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openDeleteDialog(user)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-10">
                            <UserCog className="h-10 w-10 mx-auto text-gray-400" />
                            <p className="mt-2 text-gray-500">Không có người dùng nào</p>
                        </div>
                    )}

                    {usersData && usersData.totalPages > 1 && (
                        <Pagination className="mt-4">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setPage(Math.max(1, page - 1))}
                                        className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>

                                {[...Array(usersData.totalPages)].map((_, i) => {
                                    const pageNumber = i + 1;
                                    // Show current page, first, last, and pages around current
                                    if (
                                        pageNumber === 1 ||
                                        pageNumber === usersData.totalPages ||
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
                                    if (pageNumber === 2 || pageNumber === usersData.totalPages - 1) {
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
                                        onClick={() => setPage(Math.min(usersData.totalPages, page + 1))}
                                        className={page === usersData.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </CardContent>
            </Card>

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                        <DialogDescription>
                            Cập nhật thông tin người dùng.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(handleEditUser)} className="space-y-4">
                            <FormField
                                control={editForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Họ tên</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nguyễn Văn A" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vai trò</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn vai trò" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="admin">Quản trị viên</SelectItem>
                                                <SelectItem value="doctor">Bác sĩ</SelectItem>
                                                <SelectItem value="nurse">Y tá</SelectItem>
                                                <SelectItem value="staff">Nhân viên</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="specialization"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Chuyên khoa (chỉ cho bác sĩ)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nội khoa, Ngoại khoa, ..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số điện thoại</FormLabel>
                                        <FormControl>
                                            <Input placeholder="0123456789" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit">Lưu thay đổi</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete User Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa người dùng {selectedUser?.fullName}? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
                        <Button variant="destructive" onClick={handleDeleteUser}>Xóa</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserManagement;
