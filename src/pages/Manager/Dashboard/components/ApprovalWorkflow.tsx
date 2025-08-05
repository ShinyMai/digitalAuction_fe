import React from 'react';
import { Card, Steps, Typography, Badge, Space } from 'antd';
import {
    FileTextOutlined,
    AuditOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface ApprovalWorkflowProps {
    loading?: boolean;
}

interface WorkflowStep {
    title: string;
    description: string;
    status: 'wait' | 'process' | 'finish' | 'error';
    count: number;
    avgTime: string;
}

const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({ loading = false }) => {
    // TODO: Replace with real data from API
    const workflowSteps: WorkflowStep[] = [
        {
            title: 'Submission',
            description: 'Documents submitted',
            status: 'finish',
            count: 45,
            avgTime: '0.5h'
        },
        {
            title: 'Review',
            description: 'Under review process',
            status: 'process',
            count: 12,
            avgTime: '2.1h'
        },
        {
            title: 'Approval',
            description: 'Manager approval',
            status: 'wait',
            count: 8,
            avgTime: '1.8h'
        },
        {
            title: 'Publication',
            description: 'Ready for auction',
            status: 'wait',
            count: 0,
            avgTime: '0.3h'
        }
    ];

    const stepItems = workflowSteps.map((step, index) => ({
        title: (
            <div>
                <Text strong className="text-sm">{step.title}</Text>
                <div className="flex items-center gap-2 mt-1">
                    <Badge
                        count={step.count}
                        style={{ backgroundColor: '#52c41a' }}
                        size="small"
                    />
                    <Text className="text-xs text-gray-500">
                        Avg: {step.avgTime}
                    </Text>
                </div>
            </div>
        ),
        description: (
            <Text className="text-xs text-gray-500">
                {step.description}
            </Text>
        ),
        status: step.status,
        icon: index === 0 ? <FileTextOutlined /> :
            index === 1 ? <AuditOutlined /> :
                index === 2 ? <CheckCircleOutlined /> :
                    <ClockCircleOutlined />
    }));

    const totalInProgress = workflowSteps.reduce((sum, step) => sum + step.count, 0);
    const bottleneckStep = workflowSteps.reduce((prev, current) =>
        (prev.count > current.count) ? prev : current
    );

    return (
        <Card
            title={
                <div className="flex items-center gap-2">
                    <AuditOutlined className="text-green-500" />
                    <Title level={4} className="!mb-0">Approval Workflow</Title>
                </div>
            }
            loading={loading}
            className="shadow-md"
        >
            {/* Workflow Stats */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <div className="text-xl font-bold text-blue-600">{totalInProgress}</div>
                        <Text className="text-sm text-gray-600">Total in Progress</Text>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-orange-600">2.1h</div>
                        <Text className="text-sm text-gray-600">Avg Processing</Text>
                    </div>
                </div>
            </div>

            {/* Workflow Steps */}
            <Steps
                direction="vertical"
                size="small"
                items={stepItems}
                className="mb-6"
            />

            {/* Bottleneck Alert */}
            {bottleneckStep.count > 10 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <ClockCircleOutlined className="text-yellow-600" />
                        <Text strong className="text-yellow-800">Bottleneck Detected</Text>
                    </div>
                    <Text className="text-sm text-yellow-700">
                        {bottleneckStep.title} stage has {bottleneckStep.count} pending items.
                        Consider allocating more resources to improve flow.
                    </Text>
                </div>
            )}

            {/* Quick Actions */}
            <div className="mt-4">
                <Title level={5} className="!mb-3">🚀 Quick Actions</Title>
                <Space direction="vertical" size="small" className="w-full">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <Text className="text-sm">Bulk Approve (5 ready)</Text>
                        <Badge count="New" style={{ backgroundColor: '#52c41a' }} />
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <Text className="text-sm">Priority Review (3 urgent)</Text>
                        <Badge count="!" style={{ backgroundColor: '#f5222d' }} />
                    </div>
                    <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                        <Text className="text-sm">Generate Report</Text>
                        <Badge count="📊" style={{ backgroundColor: '#722ed1' }} />
                    </div>
                </Space>
            </div>
        </Card>
    );
};

export default ApprovalWorkflow;
