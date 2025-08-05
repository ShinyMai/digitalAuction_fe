import React from 'react';
import { Card, Row, Col, Statistic, Typography, List, Progress, Tag, Space } from 'antd';
import {
    TeamOutlined,
    BranchesOutlined,
    ThunderboltOutlined,
    SafetyOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface OperationalExcellenceProps {
    loading?: boolean;
}

interface DepartmentPerformance {
    name: string;
    efficiency: number;
    satisfaction: number;
    workload: number;
    status: 'excellent' | 'good' | 'average' | 'poor';
}

const OperationalExcellence: React.FC<OperationalExcellenceProps> = ({ loading = false }) => {
    // TODO: Replace with real data from API
    const departmentData: DepartmentPerformance[] = [
        {
            name: 'Phòng Đấu giá',
            efficiency: 92,
            satisfaction: 88,
            workload: 85,
            status: 'excellent'
        },
        {
            name: 'Phòng Tài chính',
            efficiency: 87,
            satisfaction: 91,
            workload: 78,
            status: 'good'
        },
        {
            name: 'Phòng Pháp chế',
            efficiency: 83,
            satisfaction: 85,
            workload: 92,
            status: 'good'
        },
        {
            name: 'Phòng IT',
            efficiency: 95,
            satisfaction: 89,
            workload: 88,
            status: 'excellent'
        }
    ];

    const processMetrics = [
        { name: 'Automation Rate', value: 78, target: 85, unit: '%' },
        { name: 'Error Rate', value: 2.1, target: 3.0, unit: '%', inverse: true },
        { name: 'Response Time', value: 1.8, target: 2.0, unit: 'h', inverse: true },
        { name: 'Compliance Score', value: 96, target: 95, unit: '%' }
    ];

    const riskIndicators = [
        {
            title: 'Operational Risk',
            level: 'low',
            description: 'All systems operational',
            icon: <CheckCircleOutlined />
        },
        {
            title: 'Compliance Risk',
            level: 'medium',
            description: 'Minor policy updates needed',
            icon: <ExclamationCircleOutlined />
        },
        {
            title: 'Security Risk',
            level: 'low',
            description: 'Security measures effective',
            icon: <SafetyOutlined />
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'excellent': return '#52c41a';
            case 'good': return '#1890ff';
            case 'average': return '#faad14';
            case 'poor': return '#f5222d';
            default: return '#8c8c8c';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'excellent': return 'Xuất sắc';
            case 'good': return 'Tốt';
            case 'average': return 'Trung bình';
            case 'poor': return 'Cần cải thiện';
            default: return 'Chưa đánh giá';
        }
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'low': return 'green';
            case 'medium': return 'orange';
            case 'high': return 'red';
            default: return 'default';
        }
    };

    const calculateOverallScore = (dept: DepartmentPerformance) => {
        return Math.round((dept.efficiency + dept.satisfaction + (100 - dept.workload)) / 3);
    };

    return (
        <Space direction="vertical" size="large" className="w-full">
            {/* Department Performance Overview */}
            <Card
                title={
                    <div className="flex items-center gap-2">
                        <BranchesOutlined className="text-blue-500" />
                        <Title level={4} className="!mb-0">Department Performance</Title>
                    </div>
                }
                loading={loading}
                className="shadow-md"
            >
                <div className="space-y-4">
                    {departmentData.map((dept, index) => (
                        <Card
                            key={index}
                            size="small"
                            className="!border-gray-200"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <TeamOutlined style={{ color: getStatusColor(dept.status) }} />
                                    <Text strong>{dept.name}</Text>
                                </div>
                                <Tag color={getStatusColor(dept.status)}>
                                    {getStatusText(dept.status)}
                                </Tag>
                            </div>

                            <Row gutter={[8, 8]}>
                                <Col xs={8}>
                                    <Text className="text-xs text-gray-500">Hiệu suất</Text>
                                    <Progress
                                        percent={dept.efficiency}
                                        size="small"
                                        strokeColor="#52c41a"
                                        format={(percent) => `${percent}%`}
                                    />
                                </Col>
                                <Col xs={8}>
                                    <Text className="text-xs text-gray-500">Hài lòng</Text>
                                    <Progress
                                        percent={dept.satisfaction}
                                        size="small"
                                        strokeColor="#1890ff"
                                        format={(percent) => `${percent}%`}
                                    />
                                </Col>
                                <Col xs={8}>
                                    <Text className="text-xs text-gray-500">Tải</Text>
                                    <Progress
                                        percent={dept.workload}
                                        size="small"
                                        strokeColor={dept.workload > 90 ? "#f5222d" : "#faad14"}
                                        format={(percent) => `${percent}%`}
                                    />
                                </Col>
                            </Row>

                            <div className="mt-2 text-center">
                                <Text className="text-lg font-bold" style={{ color: getStatusColor(dept.status) }}>
                                    {calculateOverallScore(dept)}/100
                                </Text>
                                <Text className="text-xs text-gray-500 ml-2">Overall Score</Text>
                            </div>
                        </Card>
                    ))}
                </div>
            </Card>

            {/* Process Efficiency */}
            <Card
                title={
                    <div className="flex items-center gap-2">
                        <ThunderboltOutlined className="text-yellow-500" />
                        <Title level={4} className="!mb-0">Process Efficiency</Title>
                    </div>
                }
                loading={loading}
                className="shadow-md"
            >
                <Row gutter={[16, 16]}>
                    {processMetrics.map((metric, index) => (
                        <Col xs={24} sm={12} key={index}>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <Text className="text-sm text-gray-600 block mb-2">
                                    {metric.name}
                                </Text>
                                <Statistic
                                    value={metric.value}
                                    suffix={metric.unit}
                                    valueStyle={{
                                        fontSize: '1.2rem',
                                        color: metric.inverse
                                            ? (metric.value <= metric.target ? '#52c41a' : '#f5222d')
                                            : (metric.value >= metric.target ? '#52c41a' : '#f5222d')
                                    }}
                                />
                                <Text className="text-xs text-gray-500">
                                    Target: {metric.target}{metric.unit}
                                </Text>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Card>

            {/* Risk Management */}
            <Card
                title={
                    <div className="flex items-center gap-2">
                        <SafetyOutlined className="text-red-500" />
                        <Title level={4} className="!mb-0">Risk Management</Title>
                    </div>
                }
                loading={loading}
                className="shadow-md"
            >
                <List
                    dataSource={riskIndicators}
                    renderItem={(item, index) => (
                        <List.Item key={index} className="!border-0 !p-3 !bg-gray-50 !rounded !mb-2">
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-3">
                                    <div style={{
                                        color: getRiskColor(item.level) === 'green' ? '#52c41a' :
                                            getRiskColor(item.level) === 'orange' ? '#faad14' : '#f5222d'
                                    }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <Text strong className="text-sm">{item.title}</Text>
                                        <div>
                                            <Text className="text-xs text-gray-500">
                                                {item.description}
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                                <Tag color={getRiskColor(item.level)}>
                                    {item.level.toUpperCase()}
                                </Tag>
                            </div>
                        </List.Item>
                    )}
                />
            </Card>
        </Space>
    );
};

export default OperationalExcellence;
