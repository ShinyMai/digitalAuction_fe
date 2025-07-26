import React from 'react';
import { Card, Table, Tag, Button, Typography, Space } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { AuctionPerformance } from '../types';

const { Title } = Typography;

interface AuctionPerformanceTableProps {
    data: AuctionPerformance[];
    onViewDetail: (auctionId: string) => void;
}

const AuctionPerformanceTable: React.FC<AuctionPerformanceTableProps> = ({
    data,
    onViewDetail
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Hoàn thành': return 'success';
            case 'Đang diễn ra': return 'processing';
            case 'Đã hủy': return 'error';
            default: return 'default';
        }
    };

    const columns: ColumnsType<AuctionPerformance> = [
        {
            title: 'Tên cuộc đấu giá',
            dataIndex: 'auctionName',
            key: 'auctionName',
            width: 200,
            render: (text: string) => (
                <span className="!font-medium !text-gray-800">{text}</span>
            ),
        },
        {
            title: 'Ngày',
            dataIndex: 'date',
            key: 'date',
            width: 120,
            render: (date: string) => (
                <span className="!text-gray-600">
                    {new Date(date).toLocaleDateString('vi-VN')}
                </span>
            ),
        },
        {
            title: 'Người tham gia',
            dataIndex: 'participants',
            key: 'participants',
            width: 120,
            align: 'center',
            render: (count: number) => (
                <span className="!font-medium !text-blue-600">{count} người</span>
            ),
        },
        {
            title: 'Số vòng',
            dataIndex: 'completedRounds',
            key: 'completedRounds',
            width: 100,
            align: 'center',
            render: (rounds: number) => (
                <span className="!font-medium">{rounds} vòng</span>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: 'duration',
            key: 'duration',
            width: 100,
            align: 'center',
            render: (duration: number) => (
                <span className="!text-gray-600">{formatDuration(duration)}</span>
            ),
        },
        {
            title: 'Doanh thu',
            dataIndex: 'revenue',
            key: 'revenue',
            width: 150,
            align: 'right',
            render: (revenue: number) => (
                <span className="!font-medium !text-green-600">
                    {formatCurrency(revenue)}
                </span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            align: 'center',
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>{status}</Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => onViewDetail(record.auctionId)}
                    className="!p-0"
                >
                    Chi tiết
                </Button>
            ),
        },
    ];

    const handleExport = () => {
        // Logic xuất báo cáo Excel/PDF
        console.log('Exporting auction performance data...');
    };

    return (
        <Card
            title={
                <div className="!flex !justify-between !items-center">
                    <Title level={4} className="!m-0">
                        Hiệu Suất Cuộc Đấu Giá
                    </Title>
                    <Space>
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={handleExport}
                        >
                            Xuất báo cáo
                        </Button>
                    </Space>
                </div>
            }
            className="!shadow-sm"
        >
            <Table
                columns={columns}
                dataSource={data}
                rowKey="auctionId"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} trong ${total} cuộc đấu giá`,
                }}
                scroll={{ x: 800 }}
                className="!mt-4"
            />
        </Card>
    );
};

export default AuctionPerformanceTable;
