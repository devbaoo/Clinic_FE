import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/services/store/store';
import { logout, selectCurrentUser } from '@/services/features/auth/authSlice';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Home,
    Users,
    Calendar,
    FileText,
    Settings,
    User,
    LogOut,
    Menu,
    X,
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navigation = [
        { name: 'Trang chủ', href: '/dashboard', icon: Home },
        { name: 'Bệnh nhân', href: '/patients', icon: Users },
        { name: 'Lịch hẹn', href: '/appointments', icon: Calendar },
        { name: 'Đơn thuốc', href: '/prescriptions', icon: FileText },
    ];

    // Add admin-only navigation items
    if (currentUser?.role === 'admin') {
        navigation.push({ name: 'Quản lý người dùng', href: '/users', icon: Settings });
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Mobile sidebar */}
            <div className="lg:hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 left-4 z-50"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* Sidebar */}
            <div
                className={cn(
                    'fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center h-16 px-4 border-b">
                        <h1 className="text-xl font-bold">Phòng khám</h1>
                    </div>

                    <div className="flex-1 px-4 py-4 overflow-y-auto">
                        <nav className="space-y-1">
                            {navigation.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    className={({ isActive }) =>
                                        cn(
                                            'flex items-center px-2 py-2 text-sm font-medium rounded-md',
                                            isActive
                                                ? 'bg-primary text-primary-foreground'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        )
                                    }
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    <div className="p-4 border-t">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                                    {currentUser?.firstName?.charAt(0) || 'U'}
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium">{currentUser?.firstName} {currentUser?.lastName}</p>
                                <p className="text-xs text-gray-500">
                                    {currentUser?.role === 'admin'
                                        ? 'Quản trị viên'
                                        : currentUser?.role === 'doctor'
                                            ? 'Bác sĩ'
                                            : currentUser?.role === 'nurse'
                                                ? 'Y tá'
                                                : 'Nhân viên'}
                                </p>
                            </div>
                            <div className="ml-auto">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Settings className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => navigate('/profile')}>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Hồ sơ</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Đăng xuất</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Main content header */}
                <header className="bg-white shadow-sm z-10">
                    <div className="px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-lg font-semibold text-gray-900">Hệ thống Quản lý Phòng khám</h1>
                            <div className="flex items-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="hidden lg:flex">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>{currentUser?.firstName} {currentUser?.lastName}</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => navigate('/profile')}>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Hồ sơ</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Đăng xuất</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
                    <Outlet />
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default DashboardLayout;
