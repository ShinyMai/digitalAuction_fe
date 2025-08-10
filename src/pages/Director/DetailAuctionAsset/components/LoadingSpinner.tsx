import { Spin } from "antd";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <Spin size="large" />
        <div className="!mt-4 !text-gray-600">
          Đang tải thông tin tài sản...
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
