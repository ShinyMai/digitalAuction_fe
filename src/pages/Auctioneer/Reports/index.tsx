import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Space, message } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import OverviewStats from './components/OverviewStats';
import ReportControls from './components/ReportControls';
import ReportCharts from './components/ReportCharts';
import AuctionPerformanceTable from './components/AuctionPerformanceTable';
import {
    performanceStats,
    participantStats,
    auctionPerformanceData,
    revenueChartData,
    topAssets,
    categoryDistribution,
    participantTrendData
} from './fakeData';
import type { ReportFilters } from './types';
import "../../../styles/auction-tabs.css";

const { Title } = Typography;

interface ReportsProps {
    loading?: boolean;
}

const Reports: React.FC<ReportsProps> = ({ loading = false }) => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<ReportFilters>({
        dateRange: {
            startDate: '',
            endDate: ''
        }
    });

    useEffect(() => {
        // Load initial data or API call
        console.log('Reports loaded with filters:', filters);
    }, [filters]);

    const handleFiltersChange = (newFilters: ReportFilters) => {
        setFilters(newFilters);
        console.log('Filters changed:', newFilters);
    };

    const handleRefresh = () => {
        message.info('Đang làm mới dữ liệu...');
        // Simulate API refresh
        setTimeout(() => {
            message.success('Dữ liệu đã được cập nhật!');
        }, 1000);
    };

    const handleExport = (format: 'excel' | 'pdf') => {
        message.loading(`Đang xuất báo cáo ${format.toUpperCase()}...`);
        // Simulate export
        setTimeout(() => {
            message.success(`Xuất báo cáo ${format.toUpperCase()} thành công!`);
        }, 2000);
    };

    const handleViewAuctionDetail = (auctionId: string) => {
        navigate(`/auctioneer/auction-detail/${auctionId}`);
    };

    if (loading) {
        return (
            <div className="!min-h-screen !bg-gray-50 !p-6">
                <div className="!max-w-7xl !mx-auto">
                    <div className="!text-center !py-20">
                        <div className="!text-xl !text-gray-600">Đang tải dữ liệu báo cáo...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="!min-h-screen !bg-gray-50 !p-6">
            <div className="!max-w-7xl !mx-auto">
                {/* Header */}
                <div className="!mb-6">
                    <Space align="center" className="!mb-4">
                        <BarChartOutlined className="!text-2xl !text-blue-500" />
                        <Title level={2} className="!m-0 !text-gray-800">
                            Báo Cáo & Thống Kê
                        </Title>
                    </Space>
                    <p className="!text-gray-600 !text-base !m-0">
                        Tổng quan hiệu suất, phân tích dữ liệu và báo cáo chi tiết về hoạt động đấu giá
                    </p>
                </div>

                {/* Controls */}
                <ReportControls
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onRefresh={handleRefresh}
                    onExport={handleExport}
                />

                {/* Overview Statistics */}
                <OverviewStats
                    performanceStats={performanceStats}
                    participantStats={participantStats}
                />

                {/* Charts Section */}
                <ReportCharts
                    revenueData={revenueChartData}
                    topAssets={topAssets}
                    categoryDistribution={categoryDistribution}
                    participantTrend={participantTrendData}
                />

                {/* Performance Table */}
                <AuctionPerformanceTable
                    data={auctionPerformanceData}
                    onViewDetail={handleViewAuctionDetail}
                />
            </div>
        </div>
    );
};

export default Reports;
