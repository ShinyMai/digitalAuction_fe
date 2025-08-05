import React from 'react';
import { Card, List, Progress, Tag, Typography, Space } from 'antd';
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
    id: string;
    type: 'auction' | 'document' | 'participant';
    title: string;
    submitter: string;
    submitTime: string;
    urgency: 'high' | 'medium' | 'low';
    status: 'pending' | 'processing' | 'completed';
}

const ApprovalManagement: React.FC<ApprovalManagementProps> = ({ loading = false }) => {
    // TODO: Replace with real data from API
    const pendingApprovals: ApprovalItem[] = [
        {
            id: '1',
            type: 'auction',
            title: 'Phiên đấu giá tài sản BĐS Quận 1',
            submitter: 'Nguyễn Văn A',
            submitTime: '2 giờ trước',
            urgency: 'high',
            status: 'pending'
        },
        {
            id: '2',
            type: 'document',
            title: 'Hồ sơ tham gia đấu giá - Công ty ABC',
            submitter: 'Trần Thị B',
            submitTime: '4 giờ trước',
            urgency: 'medium',
            status: 'processing'
        },
        {
            id: '3',
            type: 'participant',
            title: 'Xác minh danh tính người tham gia',
            submitter: 'Lê Văn C',
            submitTime: '6 giờ trước',
            urgency: 'low',
            status: 'pending'
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <ClockCircleOutlined className="text-orange-500" />;
            case 'processing': return <ExclamationCircleOutlined className="text-blue-500" />;
            case 'completed': return <CheckCircleOutlined className="text-green-500" />;
            default: return <ClockCircleOutlined />;
        }
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

            {/* Progress Bar */}
            <div className="mb-4">
                <Text className="text-sm text-gray-600">Tiến độ xử lý trong tuần</Text>
                <Progress
                    percent={approvalStats.completionRate}
                    strokeColor="#52c41a"
                    className="mb-2"
                />
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
                                    {getStatusIcon(item.status)}
                                </Space>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>Bởi: {item.submitter}</span>
                                <span>{item.submitTime}</span>
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default ApprovalManagement;
