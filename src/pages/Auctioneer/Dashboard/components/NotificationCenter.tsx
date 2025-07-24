import React from 'react';
import { Card, List, Typography, Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';

const { Title } = Typography;

const NotificationCenter: React.FC = () => {
    // TODO: Replace with real data from API and integrate with websocket
    const notifications = [
        {
            id: 1,
            title: 'Phiên đấu giá sắp bắt đầu',
            message: 'Phiên đấu giá #123 sẽ bắt đầu trong 30 phút',
            time: '5 phút trước',
            read: false
        },
        {
            id: 2,
            title: 'Yêu cầu xác minh mới',
            message: 'Có một yêu cầu xác minh mới từ người tham gia',
            time: '1 giờ trước',
            read: true
        },
        {
            id: 3,
            title: 'Cập nhật hồ sơ',
            message: 'Hồ sơ #456 đã được cập nhật thông tin mới',
            time: '2 giờ trước',
            read: true
        }
    ];

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <Title level={5} className="mb-0">Thông báo</Title>
                <Badge count={notifications.filter(n => !n.read).length}>
                    <BellOutlined className="text-xl" />
                </Badge>
            </div>
            <List
                itemLayout="horizontal"
                dataSource={notifications}
                renderItem={item => (
                    <List.Item className={`cursor-pointer hover:bg-gray-50 ${!item.read ? 'bg-blue-50' : ''}`}>
                        <List.Item.Meta
                            title={item.title}
                            description={
                                <div>
                                    <div>{item.message}</div>
                                    <div className="text-gray-400 text-xs mt-1">{item.time}</div>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default NotificationCenter;
