import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center">
            <FileQuestion className="h-12 w-12 text-gray-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center mt-4">Trang không tồn tại</CardTitle>
          <CardDescription className="text-center">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>
            Vui lòng kiểm tra lại URL hoặc quay lại trang chủ.
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

export default NotFound;