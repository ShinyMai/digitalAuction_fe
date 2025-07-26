import React from 'react';
import { Card, Button, Row, Col, Typography } from 'antd';
import { CalendarOutlined, AuditOutlined, ProfileOutlined, TeamOutlined } from '@ant-design/icons';

const { Title } = Typography;

const QuickActions: React.FC = () => {
    const actions = [
        {
            icon: <CalendarOutlined className="text-xl" />,
            title: 'Phiên đấu giá',
            onClick: () => { /* Navigate to auctions */ }
        },
        {
            icon: <AuditOutlined className="text-xl" />,
            title: 'Kiểm tra hồ sơ',
            onClick: () => { /* Navigate to profile checks */ }
        },
        {
            icon: <ProfileOutlined className="text-xl" />,
            title: 'Báo cáo',
            onClick: () => { /* Navigate to reports */ }
        },
        {
            icon: <TeamOutlined className="text-xl" />,
            title: 'Người tham gia',
            onClick: () => { /* Navigate to participants */ }
        }
    ];

    return (
        <Card className="!mb-6">
            <Title level={5} className="mb-4">Thao tác nhanh</Title>
            <Row gutter={[16, 16]}>
                {actions.map((action, index) => (
                    <Col xs={12} sm={6} key={index}>
                        <Button
                            type="default"
                            icon={action.icon}
                            onClick={action.onClick}
                            className="w-full h-20 flex flex-col items-center justify-center"
                        >
                            <span className="mt-2">{action.title}</span>
                        </Button>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default QuickActions;
