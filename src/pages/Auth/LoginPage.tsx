import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch } from '@/services/store/store';
import { setCredentials } from '@/services/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

// Define form schema with Zod
const loginSchema = z.object({
    username: z.string().min(1, 'Tên đăng nhập là bắt buộc'),
    password: z.string().min(1, 'Mật khẩu là bắt buộc'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const from = location.state?.from?.pathname || '/';

    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            // Mock login - replace with actual authentication logic
            if (data.username === 'admin' && data.password === 'admin') {
                const mockUser = {
                    id: '1',
                    email: 'admin@clinic.com',
                    firstName: 'Admin',
                    lastName: 'User',
                    role: 'admin' as const,
                    isActive: true,
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z',
                };

                dispatch(setCredentials({
                    user: mockUser,
                    token: 'mock-jwt-token'
                }));

                navigate(from, { replace: true });
            } else if (data.username === 'doctor' && data.password === 'doctor') {
                const mockUser = {
                    id: '2',
                    email: 'doctor@clinic.com',
                    firstName: 'Dr. John',
                    lastName: 'Smith',
                    role: 'doctor' as const,
                    isActive: true,
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z',
                };

                dispatch(setCredentials({
                    user: mockUser,
                    token: 'mock-jwt-token'
                }));

                navigate(from, { replace: true });
            } else {
                setError('Tên đăng nhập hoặc mật khẩu không đúng');
            }
        } catch (err) {
            setError('Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Đăng nhập</CardTitle>
                    <CardDescription className="text-center">
                        Đăng nhập vào hệ thống Quản lý Phòng khám
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên đăng nhập</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nhập tên đăng nhập" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mật khẩu</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Nhập mật khẩu" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang đăng nhập...
                                    </>
                                ) : (
                                    'Đăng nhập'
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">
                        Demo: admin/admin hoặc doctor/doctor
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
