import React, { useState, useEffect } from 'react';
import { Row, Col, Space, Typography, DatePicker, Select } from 'antd';
import {
    BarChartOutlined
} from '@ant-design/icons';
import BusinessOverview from './components/BusinessOverview';
import RevenueChart from './components/RevenueChart';
import PerformanceAnalytics from './components/PerformanceAnalytics';
import ApprovalManagement from './components/ApprovalManagement';
import ApprovalWorkflow from './components/ApprovalWorkflow';
import type { RangePickerProps } from 'antd/es/date-picker';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface DateRange {
    startDate: string;
    endDate: string;
}

const ManagerDashboard: React.FC = () => {
    const [dateRange, setDateRange] = useState<DateRange | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
    const [loading, setLoading] = useState(false);

    // TODO: Fetch data from APIs
    useEffect(() => {
        fetchDashboardData();
    }, [dateRange, selectedDepartment]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Call APIs here
            // await Promise.all([
            //     getManagerStatistics(),
            //     getApprovalMetrics(),
            //     getPerformanceData()
            // ]);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
        if (dates && dateStrings[0] && dateStrings[1]) {
            setDateRange({
                startDate: dateStrings[0],
                endDate: dateStrings[1]
            });
        } else {
            setDateRange(null);
        }
    };

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Title level={2} className="!mb-2 !text-gray-800">
                            <BarChartOutlined className="!mr-3 !text-blue-600" />
                            Manager Dashboard
                        </Title>
                        <p className="!text-gray-600 !mb-0">
                            Tổng quan quản lý và phê duyệt đấu giá
                        </p>
                    </div>

                    {/* Filters */}
                    <Space size="middle" wrap>
                        <RangePicker
                            onChange={handleDateRangeChange}
                            placeholder={['Từ ngày', 'Đến ngày']}
                        />
                        <Select
                            value={selectedDepartment}
                            onChange={setSelectedDepartment}
                            style={{ width: 200 }}
                            options={[
                                { label: 'Tất cả phòng ban', value: 'all' },
                                { label: 'Phòng Đấu giá', value: 'auction' },
                                { label: 'Phòng Tài chính', value: 'finance' },
                                { label: 'Phòng Pháp chế', value: 'legal' }
                            ]}
                        />
                    </Space>
                </div>
            </div>

            {/* Main Content */}
            <Row gutter={[16, 16]}>
                {/* Business Overview Cards */}
                <Col xs={24}>
                    <BusinessOverview loading={loading} />
                </Col>

                {/* Revenue Chart */}
                <Col xs={24} lg={12}>
                    <RevenueChart loading={loading} />
                </Col>

                {/* Performance Analytics */}
                <Col xs={24} lg={12}>
                    <PerformanceAnalytics loading={loading} />
                </Col>

                {/* Approval Management */}
                <Col xs={24} lg={12}>
                    <ApprovalManagement loading={loading} />
                </Col>

                {/* Approval Workflow */}
                <Col xs={24} lg={12}>
                    <ApprovalWorkflow loading={loading} />
                </Col>
            </Row>
        </div>
    );
};

export default ManagerDashboard;
