import { Card } from "antd";

interface StatsCardsProps {
  stats: {
    total: number;
    registration: number;
    upcoming: number;
    ongoing: number;
    completed: number;
    cancelled: number;
  };
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <Card className="!text-center !bg-gradient-to-r !from-blue-500 !to-blue-600 !border-0 !shadow-lg">
        <div className="text-white">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm opacity-90">Tổng đăng ký</div>
        </div>
      </Card>
      <Card className="!text-center !bg-gradient-to-r !from-cyan-500 !to-cyan-600 !border-0 !shadow-lg">
        <div className="text-white">
          <div className="text-2xl font-bold">{stats.registration}</div>
          <div className="text-sm opacity-90">Đang đăng ký</div>
        </div>
      </Card>
      <Card className="!text-center !bg-gradient-to-r !from-orange-500 !to-orange-600 !border-0 !shadow-lg">
        <div className="text-white">
          <div className="text-2xl font-bold">{stats.upcoming}</div>
          <div className="text-sm opacity-90">Sắp diễn ra</div>
        </div>
      </Card>
      <Card className="!text-center !bg-gradient-to-r !from-green-500 !to-green-600 !border-0 !shadow-lg">
        <div className="text-white">
          <div className="text-2xl font-bold">{stats.ongoing}</div>
          <div className="text-sm opacity-90">Đang diễn ra</div>
        </div>
      </Card>
      <Card className="!text-center !bg-gradient-to-r !from-purple-500 !to-purple-600 !border-0 !shadow-lg">
        <div className="text-white">
          <div className="text-2xl font-bold">{stats.completed}</div>
          <div className="text-sm opacity-90">Đã kết thúc</div>
        </div>
      </Card>
    </div>
  );
};

export default StatsCards;
