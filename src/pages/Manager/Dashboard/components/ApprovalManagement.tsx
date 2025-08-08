import React from 'react';
import { Card, List, Tag, Typography, Space } from 'antd';
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    UserOutlined,
    FileTextOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface ApprovalManagementProps {
    loading?: boolean;
}

interface ApprovalItem {
    auctionDocumentId: string;
    auctionId: string;
    userId: string;
    userName: string;
    type: 'auction' | 'document' | 'participant';
    title: string;
    statusTicket: number; // 0: Not Payment, 1: Payment successful, 2: Cancelled
    statusDeposit: number; // 0: Not Payment, 1: Payment successful  
    createAtTicket: string;
    createAtDeposit: string;
    urgency: 'high' | 'medium' | 'low';
    bankAccount: string;
    numericalOrder: number;
}

const ApprovalManagement: React.FC<ApprovalManagementProps> = ({ loading = false }) => {
    // Mock data based on AuctionDocument structure
    const pendingApprovals: ApprovalItem[] = [
        {
            auctionDocumentId: 'doc_001',
            auctionId: 'auction_001',
            userId: 'user_001',
            userName: 'Nguyễn Văn A',
            type: 'auction',
            title: 'Phiên đấu giá tài sản BĐS Quận 1',
            statusTicket: 0, // Not Payment
            statusDeposit: 0, // Not Payment
            createAtTicket: '2024-08-05T10:00:00Z',
            createAtDeposit: '2024-08-05T12:00:00Z',
            urgency: 'high',
            bankAccount: 'Vietcombank',
            numericalOrder: 1
        },
        {
            auctionDocumentId: 'doc_002',
            auctionId: 'auction_002',
            userId: 'user_002',
            userName: 'Trần Thị B',
            type: 'document',
            title: 'Hồ sơ tham gia đấu giá - Công ty ABC',
            statusTicket: 1, // Payment successful
            statusDeposit: 0, // Not Payment
            createAtTicket: '2024-08-05T08:00:00Z',
            createAtDeposit: '2024-08-05T14:00:00Z',
            urgency: 'medium',
            bankAccount: 'BIDV',
            numericalOrder: 2
        },
        {
            auctionDocumentId: 'doc_003',
            auctionId: 'auction_003',
            userId: 'user_003',
            userName: 'Lê Văn C',
            type: 'participant',
            title: 'Xác minh danh tính người tham gia',
            statusTicket: 1, // Payment successful
            statusDeposit: 1, // Payment successful
            createAtTicket: '2024-08-05T06:00:00Z',
            createAtDeposit: '2024-08-05T16:00:00Z',
            urgency: 'low',
            bankAccount: 'ACB',
            numericalOrder: 3
        }
    ];

    const approvalStats = {
        totalPending: 12,
        highPriority: 3,
        avgProcessingTime: 2.5, // hours
        completionRate: 94.2
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'auction': return <FileTextOutlined className="text-blue-500" />;
            case 'document': return <FileTextOutlined className="text-green-500" />;
            case 'participant': return <UserOutlined className="text-purple-500" />;
            default: return <FileTextOutlined />;
        }
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'high': return 'red';
            case 'medium': return 'orange';
            case 'low': return 'green';
            default: return 'default';
        }
    };

    const getStatusIcon = (statusTicket: number, statusDeposit: number) => {
        // Determine overall status based on ticket and deposit status
        if (statusTicket === 0 && statusDeposit === 0) {
            return <ClockCircleOutlined className="text-orange-500" />; // Pending
        } else if (statusTicket === 1 && statusDeposit === 0) {
            return <ExclamationCircleOutlined className="text-blue-500" />; // Processing
        } else if (statusTicket === 1 && statusDeposit === 1) {
            return <CheckCircleOutlined className="text-green-500" />; // Completed
        } else if (statusTicket === 2) {
            return <ClockCircleOutlined className="text-red-500" />; // Cancelled
        }
        return <ClockCircleOutlined />;
    };

    const formatTimeAgo = (dateString: string) => {
        const now = new Date();
        const createDate = new Date(dateString);
        const diffHours = Math.floor((now.getTime() - createDate.getTime()) / (1000 * 60 * 60));
        return `${diffHours} giờ trước`;
    };

    return (
        <Card title="⏳ Quản lý phê duyệt" loading={loading}>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-xl font-bold text-red-600">{approvalStats.totalPending}</div>
                    <div className="text-sm text-gray-600">Chờ xử lý</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">{approvalStats.highPriority}</div>
                    <div className="text-sm text-gray-600">Ưu tiên cao</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{approvalStats.avgProcessingTime}h</div>
                    <div className="text-sm text-gray-600">TG xử lý TB</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{approvalStats.completionRate}%</div>
                    <div className="text-sm text-gray-600">Tỷ lệ hoàn thành</div>
                </div>
            </div>

            {/* Pending List */}
            <Title level={5} className="!mb-3">🔔 Cần xử lý ngay</Title>
            <List
                size="small"
                dataSource={pendingApprovals}
                renderItem={(item) => (
                    <List.Item className="!p-3 !border-l-4 !border-l-blue-400 !bg-gray-50 !rounded !mb-2">
                        <div className="w-full">
                            <div className="flex justify-between items-start mb-2">
                                <Space>
                                    {getTypeIcon(item.type)}
                                    <Text strong className="text-sm">{item.title}</Text>
                                </Space>
                                <Space>
                                    <Tag color={getUrgencyColor(item.urgency)}>
                                        {item.urgency === 'high' ? 'Cao' :
                                            item.urgency === 'medium' ? 'Trung bình' : 'Thấp'}
                                    </Tag>
                                    {getStatusIcon(item.statusTicket, item.statusDeposit)}
                                </Space>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>Bởi: {item.userName}</span>
                                <span>{formatTimeAgo(item.createAtTicket)}</span>
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default ApprovalManagement;
