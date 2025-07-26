import React from 'react';
import { Card, Progress, Row, Col, Typography, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PerformanceMetrics: React.FC = () => {
    // TODO: Replace with real data from API
    const metrics = {
        successRate: {
            value: 85,
            change: 5,
            description: 'Tỷ lệ phiên đấu giá thành công'
        },
        responseTime: {
            value: 92,
            change: -2,
            description: 'Thời gian phản hồi trung bình'
        },
        participation: {
            value: 78,
            change: 8,
            description: 'Tỷ lệ người tham gia tích cực'
        }
    };

    const renderMetric = (
        title: string,
        value: number,
        change: number,
        description: string
    ) => (
        <Col span={24} className="mb-4">
            <Tooltip title={description}>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <Text>{title}</Text>
                        <div className={`flex items-center ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                            <span className="ml-1">{Math.abs(change)}%</span>
                        </div>
                    </div>
                    <Progress percent={value} showInfo={true} />
                </div>
            </Tooltip>
        </Col>
    );

    return (
        <Card>
            <Title level={5} className="mb-4">Hiệu suất</Title>
            <Row>
                {renderMetric(
                    'Tỷ lệ thành công',
                    metrics.successRate.value,
                    metrics.successRate.change,
                    metrics.successRate.description
                )}
                {renderMetric(
                    'Thời gian phản hồi',
                    metrics.responseTime.value,
                    metrics.responseTime.change,
                    metrics.responseTime.description
                )}
                {renderMetric(
                    'Mức độ tham gia',
                    metrics.participation.value,
                    metrics.participation.change,
                    metrics.participation.description
                )}
            </Row>
        </Card>
    );
};

export default PerformanceMetrics;
