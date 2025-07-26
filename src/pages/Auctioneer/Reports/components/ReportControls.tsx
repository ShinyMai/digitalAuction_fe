import React, { useState } from 'react';
import {
    Card,
    Row,
    Col,
    DatePicker,
    Select,
    Button,
    Space,
    Typography
} from 'antd';
import {
    FilterOutlined,
    ReloadOutlined,
    DownloadOutlined,
    FileExcelOutlined,
    FilePdfOutlined
} from '@ant-design/icons';
import type { ReportFilters } from '../types';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;

interface ReportControlsProps {
    filters: ReportFilters;
    onFiltersChange: (filters: ReportFilters) => void;
    onRefresh: () => void;
    onExport: (format: 'excel' | 'pdf') => void;
}

const ReportControls: React.FC<ReportControlsProps> = ({
    filters,
    onFiltersChange,
    onRefresh,
    onExport
}) => {
    const [isFiltering, setIsFiltering] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDateRangeChange = (dates: any) => {
        if (dates && dates.length === 2) {
            onFiltersChange({
                ...filters,
                dateRange: {
                    startDate: dates[0].format('YYYY-MM-DD'),
                    endDate: dates[1].format('YYYY-MM-DD')
                }
            });
        }
    };

    const handleCategoryChange = (categoryId: string) => {
        onFiltersChange({
            ...filters,
            auctionCategory: categoryId === 'all' ? undefined : categoryId
        });
    };

    const handleStatusChange = (status: string) => {
        onFiltersChange({
            ...filters,
            status: status === 'all' ? undefined : Number(status)
        });
    };

    const handleReset = () => {
        onFiltersChange({
            dateRange: {
                startDate: '',
                endDate: ''
            }
        });
    };

    const handleApplyFilters = () => {
        setIsFiltering(true);
        // Simulate API call
        setTimeout(() => {
            setIsFiltering(false);
            onRefresh();
        }, 1000);
    };

    return (
        <Card className="!mb-6 !shadow-sm">
            <div className="!mb-4">
                <Title level={4} className="!m-0 !flex !items-center !gap-2">
                    <FilterOutlined className="!text-blue-500" />
                    Bộ Lọc & Điều Khiển
                </Title>
            </div>

            <Row gutter={[16, 16]}>
                {/* Date Range Filter */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <div className="!mb-2">
                        <label className="!text-sm !font-medium !text-gray-700">
                            Khoảng thời gian
                        </label>
                    </div>
                    <RangePicker
                        className="!w-full"
                        placeholder={['Từ ngày', 'Đến ngày']}
                        onChange={handleDateRangeChange}
                        format="DD/MM/YYYY"
                    />
                </Col>

                {/* Category Filter */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <div className="!mb-2">
                        <label className="!text-sm !font-medium !text-gray-700">
                            Danh mục
                        </label>
                    </div>
                    <Select
                        className="!w-full"
                        placeholder="Chọn danh mục"
                        onChange={handleCategoryChange}
                        defaultValue="all"
                    >
                        <Option value="all">Tất cả danh mục</Option>
                        <Option value="1">Bất động sản</Option>
                        <Option value="2">Xe cộ</Option>
                        <Option value="3">Máy móc</Option>
                        <Option value="4">Nghệ thuật</Option>
                        <Option value="5">Khác</Option>
                    </Select>
                </Col>

                {/* Status Filter */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <div className="!mb-2">
                        <label className="!text-sm !font-medium !text-gray-700">
                            Trạng thái
                        </label>
                    </div>
                    <Select
                        className="!w-full"
                        placeholder="Chọn trạng thái"
                        onChange={handleStatusChange}
                        defaultValue="all"
                    >
                        <Option value="all">Tất cả trạng thái</Option>
                        <Option value="0">Bản nháp</Option>
                        <Option value="1">Công khai</Option>
                        <Option value="2">Hoàn thành</Option>
                        <Option value="3">Đã hủy</Option>
                    </Select>
                </Col>

                {/* Action Buttons */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <div className="!mb-2">
                        <label className="!text-sm !font-medium !text-gray-700">
                            Thao tác
                        </label>
                    </div>
                    <Space className="!w-full">
                        <Button
                            type="primary"
                            icon={<FilterOutlined />}
                            onClick={handleApplyFilters}
                            loading={isFiltering}
                        >
                            Lọc
                        </Button>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                    </Space>
                </Col>
            </Row>

            {/* Export Controls */}
            <div className="!mt-4 !pt-4 !border-t !border-gray-200">
                <div className="!flex !justify-between !items-center">
                    <div>
                        <span className="!text-sm !font-medium !text-gray-700">
                            Xuất báo cáo:
                        </span>
                    </div>
                    <Space>
                        <Button
                            icon={<FileExcelOutlined />}
                            onClick={() => onExport('excel')}
                            className="!text-green-600 !border-green-600 hover:!bg-green-50"
                        >
                            Excel
                        </Button>
                        <Button
                            icon={<FilePdfOutlined />}
                            onClick={() => onExport('pdf')}
                            className="!text-red-600 !border-red-600 hover:!bg-red-50"
                        >
                            PDF
                        </Button>
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={onRefresh}
                            type="primary"
                        >
                            Làm mới dữ liệu
                        </Button>
                    </Space>
                </div>
            </div>
        </Card>
    );
};

export default ReportControls;
