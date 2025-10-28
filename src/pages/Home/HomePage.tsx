import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/services/store/store';
import { selectIsAuthenticated } from '@/services/features/auth/authSlice';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Hệ thống Quản lý Phòng khám</h1>
          <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
        </div>
      </header>

      {/* Hero section */}
      <section className="flex-grow flex items-center bg-gray-50">
        <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-4xl font-bold mb-6">Giải pháp quản lý phòng khám toàn diện</h2>
            <p className="text-lg text-gray-600 mb-8">
              Hệ thống quản lý phòng khám hiện đại giúp tối ưu hóa quy trình làm việc,
              quản lý bệnh nhân, lịch hẹn và đơn thuốc một cách hiệu quả.
            </p>
            <Button size="lg" onClick={() => navigate('/login')}>
              Bắt đầu ngay
            </Button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
              <div className="h-64 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                <span className="text-gray-500">Hình ảnh minh họa</span>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Tính năng chính</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quản lý bệnh nhân</h3>
              <p className="text-gray-600">
                Quản lý thông tin bệnh nhân, lịch sử khám bệnh và hồ sơ y tế một cách đầy đủ và bảo mật.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lịch hẹn thông minh</h3>
              <p className="text-gray-600">
                Hệ thống đặt lịch hẹn linh hoạt, thông báo nhắc nhở và quản lý lịch làm việc hiệu quả.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quản lý đơn thuốc</h3>
              <p className="text-gray-600">
                Tạo và quản lý đơn thuốc điện tử, theo dõi lịch sử kê đơn và kiểm soát thuốc hiệu quả.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Hệ thống Quản lý Phòng khám</h3>
              <p className="text-gray-400 mt-2">© {new Date().getFullYear()} Bản quyền thuộc về Phòng khám</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors">Điều khoản</a>
              <a href="#" className="hover:text-primary transition-colors">Bảo mật</a>
              <a href="#" className="hover:text-primary transition-colors">Liên hệ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;