import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, DatePicker, Select, Card } from 'antd';
import {
    BarChartOutlined,
    CalendarOutlined,
    TeamOutlined
} from '@ant-design/icons';
import BusinessOverview from './components/BusinessOverview';
import RevenueChart from './components/RevenueChart';
import ApprovalManagement from './components/ApprovalManagement';
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            {/* Enhanced Header Section */}
            <div className="relative">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700"></div>

                <div className="relative z-10 px-4 md:px-6 py-8">
                    <div className="max-w-7xl mx-auto">
                        <Card className="!border-0 !shadow-2xl !bg-white/95 !backdrop-blur-sm !rounded-2xl overflow-hidden">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <BarChartOutlined className="!text-white !text-2xl" />
                                    </div>
                                    <div>
                                        <Title level={1} className="!mb-2 !text-gray-800 !text-3xl !font-bold">
                                            Manager Dashboard
                                        </Title>
                                        <p className="!text-gray-600 !mb-0 !text-lg">
                                            Tổng quan quản lý và phê duyệt đấu giá
                                        </p>
                                    </div>
                                </div>

                                {/* Enhanced Filters */}
                                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                                    <div className="relative">
                                        <CalendarOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                                        <RangePicker
                                            onChange={handleDateRangeChange}
                                            placeholder={['Từ ngày', 'Đến ngày']}
                                            className="!pl-10 !h-12 !rounded-xl !border-gray-200 hover:!border-blue-400 focus:!border-blue-500 !shadow-sm hover:!shadow-md !transition-all !duration-300"
                                            style={{ minWidth: '280px' }}
                                        />
                                    </div>
                                    <div className="relative">
                                        <TeamOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                                        <Select
                                            value={selectedDepartment}
                                            onChange={setSelectedDepartment}
                                            className="!w-full sm:!w-[220px] custom-select"
                                            size="large"
                                            options={[
                                                { label: 'Tất cả phòng ban', value: 'all' },
                                                { label: 'Phòng Đấu giá', value: 'auction' },
                                                { label: 'Phòng Tài chính', value: 'finance' },
                                                { label: 'Phòng Pháp chế', value: 'legal' }
                                            ]}
                                            style={{
                                                height: '48px',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Enhanced Main Content */}
            <div className="relative z-10 -mt-6 px-4 md:px-6 pb-8">
                <div className="max-w-7xl mx-auto">
                    <Row gutter={[24, 24]}>
                        {/* Business Overview Cards */}
                        <Col xs={24}>
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <BusinessOverview loading={loading} />
                            </div>
                        </Col>

                        {/* Revenue Chart */}
                        <Col xs={24} lg={12}>
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                                <RevenueChart loading={loading} />
                            </div>
                        </Col>

                        {/* Approval Management */}
                        <Col xs={24} lg={12}>
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                                <ApprovalManagement loading={loading} />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Global Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    .custom-select .ant-select-selector {
                        padding-left: 40px !important;
                        border-radius: 12px !important;
                        border: 1px solid #e5e7eb !important;
                        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
                        transition: all 0.3s ease !important;
                    }
                    .custom-select .ant-select-selector:hover {
                        border-color: #60a5fa !important;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                    }
                    .custom-select.ant-select-focused .ant-select-selector {
                        border-color: #3b82f6 !important;
                        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
                    }
                `
            }} />
        </div>
    );
};

export default ManagerDashboard;
