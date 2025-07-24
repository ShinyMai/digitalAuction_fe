import React from 'react';
import { Card, Timeline, Typography } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ActivityTimeline: React.FC = () => {
    // TODO: Replace with real data from API
    const activities = [
        {
            id: 1,
            title: 'Phiên đấu giá #123 đã hoàn thành',
            time: '2 giờ trước',
            status: 'success',
            description: 'Đã xác nhận người thắng cuộc và hoàn tất hồ sơ'
        },
        {
            id: 2,
            title: 'Kiểm tra hồ sơ #456',
            time: '4 giờ trước',
            status: 'processing',
            description: 'Đang trong quá trình xem xét hồ sơ đăng ký'
        },
        {
            id: 3,
            title: 'Yêu cầu xác minh mới',
            time: '1 ngày trước',
            status: 'warning',
            description: 'Cần xác minh thông tin người tham gia'
        }
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircleOutlined className="text-green-500" />;
            case 'processing':
                return <ClockCircleOutlined className="text-blue-500" />;
            case 'warning':
                return <ExclamationCircleOutlined className="text-yellow-500" />;
            default:
                return null;
        }
    };

    return (
        <Card>
            <Title level={5} className="mb-4">Hoạt động gần đây</Title>
            <Timeline
                items={activities.map(activity => ({
                    dot: getStatusIcon(activity.status),
                    children: (
                        <div key={activity.id}>
                            <div className="font-medium">{activity.title}</div>
                            <div className="text-gray-500 text-sm">{activity.description}</div>
                            <div className="text-gray-400 text-xs mt-1">{activity.time}</div>
                        </div>
                    )
                }))}
            />
        </Card>
    );
};

export default ActivityTimeline;
