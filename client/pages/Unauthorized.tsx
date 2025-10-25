import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-center">
                        <ShieldAlert className="h-12 w-12 text-red-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center mt-4">Không có quyền truy cập</CardTitle>
                    <CardDescription className="text-center">
                        Bạn không có quyền truy cập vào trang này
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p>
                        Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là một lỗi.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={() => navigate('/')}>
                        Quay lại trang chủ
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Unauthorized;
