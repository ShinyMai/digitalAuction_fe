import { Card, Typography } from "antd";
import type { ReactNode } from "react";

const { Title } = Typography;

interface StatisticCardProps {
    icon: ReactNode;
    title: string;
    count: number;
    unit?: string;
    color: {
        from: string;
        to: string;
        text: string;
        hover: string;
    };
    onClick?: () => void;
}

const StatisticCard = ({ icon, title, count, unit = "phiên", color, onClick }: StatisticCardProps) => {
    return (
        <Card
            className="hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden relative group"
            onClick={onClick}
        >
            <div className={`absolute inset-0 bg-gradient-to-r from-${color.from}/10 to-${color.to}/10 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="flex items-center gap-6 relative">
                <div className={`p-4 bg-gradient-to-br from-${color.from} to-${color.to} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl text-white">{icon}</span>
                </div>
                <div>
                    <p className={`text-${color.text} font-medium text-lg mb-1`}>{title}</p>
                    <div className="flex items-baseline gap-2">
                        <Title level={2} className={`m-0 text-${color.hover}`}>{count}</Title>
                        <span className={`text-${color.text}`}>{unit}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default StatisticCard;
