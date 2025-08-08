/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Table, Typography, Statistic, Tag, Space, Button } from "antd";
import {
    UserOutlined,
    DollarOutlined,
    HomeOutlined,
    ArrowLeftOutlined,
    DownloadOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    BarChartOutlined
} from "@ant-design/icons";
import type { AuctionRoundPriceWinner } from "../modalsData";
import type { ColumnsType } from "antd/es/table";
import { toast } from "react-toastify";
import AuctionServices from "../../../../services/AuctionServices";
import { useState } from "react";

const { Title, Text } = Typography;

interface AuctionResultsProps {
    auctionID: string;
    auctionRoundPriceWinners: AuctionRoundPriceWinner[];
    onBack: () => void;
}

const AuctionResults = ({ auctionID, auctionRoundPriceWinners, onBack }: AuctionResultsProps) => {
    const [downloading, setDownloading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<any>();

    // Function to handle file selection and auto download
    const handleFileSelect = (file: File) => {
        console.log("File selected:", file);
        setSelectedFile(file);

        // Auto process download after file selection
        processDownload(file);
    };

    // Function to handle download handbook with file picker
    const handleDownloadHandbook = () => {
        // Create a hidden file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.docx,.doc,.xlsx,.xls';
        input.style.display = 'none';

        input.onchange = (event: any) => {
            const file = event.target.files?.[0];
            if (file) {
                handleFileSelect(file);
            }
        };

        // Trigger file picker
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    };

    // Function to process the download
    const processDownload = async (fileToProcess?: File) => {
        const fileToUse = fileToProcess || selectedFile;

        if (!fileToUse) {
            toast.error('Vui lòng chọn file template');
            return;
        }

        setDownloading(true);
        try {
            // Create FormData
            const formData = new FormData();
            formData.append('auctionId', auctionID);
            formData.append('TemplateFile', fileToUse);

            console.log("Processing download with file:", {
                name: fileToUse.name,
                size: fileToUse.size,
                type: fileToUse.type
            });

            console.log("Sending FormData to API...");
            const response = await AuctionServices.exportHandbook(formData);

            if (response && response.data) {
                console.log("API Response:", response);

                // Check if response contains base64 data
                if (response.data.base64 && response.data.fileName && response.data.contentType) {
                    // Convert base64 to blob
                    const base64Data = response.data.base64;
                    const byteCharacters = atob(base64Data);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: response.data.contentType });

                    // Create download link
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = response.data.fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);

                    toast.success('Tải sổ tay đấu giá thành công!');
                }
                // Fallback: if response contains direct blob data
                else if (response.data instanceof Blob) {
                    const url = window.URL.createObjectURL(response.data);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `So_tay_dau_gia_${new Date().toISOString().split('T')[0]}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);

                    toast.success('Tải sổ tay đấu giá thành công!');
                }
                else {
                    toast.success(response.message || 'Xuất file thành công!');
                }
            }
        } catch (error: any) {
            console.error('Download error:', error);
            toast.error('Lỗi khi tải sổ tay: ' + (error.message || 'Không xác định'));
        } finally {
            setDownloading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    // Calculate comprehensive and accurate statistics
    const allParticipants = new Set(auctionRoundPriceWinners.map(item => item.citizenIdentification));
    const allAssets = new Set(auctionRoundPriceWinners.map(item => item.tagName));
    const winnersData = auctionRoundPriceWinners.filter(item => item.flagWinner);
    const successfulAssets = new Set(winnersData.map(item => item.tagName));

    const totalParticipants = allParticipants.size;
    const totalAssets = allAssets.size;
    const soldAssets = successfulAssets.size;

    const totalRevenue = winnersData.reduce((sum, item) => sum + item.auctionPrice, 0);
    const totalBidsCount = auctionRoundPriceWinners.length;

    // Calculate detailed asset statistics with accurate bid counts
    const assetDetailedStats = new Map();

    // First pass: collect all bid data for each asset
    auctionRoundPriceWinners.forEach(item => {
        const assetKey = item.tagName;

        if (!assetDetailedStats.has(assetKey)) {
            assetDetailedStats.set(assetKey, {
                tagName: item.tagName,
                bids: [],
                isSuccessful: false,
                winnerInfo: null
            });
        }

        const assetData = assetDetailedStats.get(assetKey);
        assetData.bids.push({
            price: item.auctionPrice,
            bidder: item.userName,
            cccd: item.citizenIdentification,
            time: item.createdAt,
            isWinner: item.flagWinner
        });

        if (item.flagWinner) {
            assetData.isSuccessful = true;
            assetData.winnerInfo = {
                name: item.userName,
                cccd: item.citizenIdentification,
                winningPrice: item.auctionPrice,
                time: item.createdAt
            };
        }
    });

    // Second pass: calculate statistics for each asset
    const assetStatsArray = Array.from(assetDetailedStats.values()).map(asset => {
        // Sort bids by price descending to get accurate highest price
        const sortedBids = asset.bids.sort((a: any, b: any) => b.price - a.price);
        const uniqueBidders = new Set(asset.bids.map((bid: any) => bid.cccd)).size;

        return {
            tagName: asset.tagName,
            totalBids: asset.bids.length,
            uniqueBidders: uniqueBidders,
            highestPrice: sortedBids[0]?.price || 0,
            lowestPrice: sortedBids[sortedBids.length - 1]?.price || 0,
            priceRange: sortedBids[0]?.price - sortedBids[sortedBids.length - 1]?.price || 0,
            isSuccessful: asset.isSuccessful,
            winnerInfo: asset.winnerInfo,
            competitionLevel: uniqueBidders > 5 ? 'Cao' : uniqueBidders > 2 ? 'Trung bình' : 'Thấp'
        };
    });

    // Asset statistics table columns - Enhanced with more meaningful data
    // Asset statistics table columns - Enhanced with more meaningful data
    const assetColumns: ColumnsType<any> = [
        {
            title: 'Tài sản',
            dataIndex: 'tagName',
            key: 'tagName',
            fixed: 'left',
            width: 150,
            render: (text) => (
                <Tag color="blue" className="text-sm font-medium px-3 py-1">
                    {text}
                </Tag>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isSuccessful',
            key: 'isSuccessful',
            width: 120,
            render: (isSuccessful) => (
                <Tag
                    color={isSuccessful ? 'success' : 'error'}
                    icon={isSuccessful ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    className="font-medium"
                >
                    {isSuccessful ? 'Đã bán' : 'Chưa bán'}
                </Tag>
            ),
            filters: [
                { text: 'Đã bán', value: true },
                { text: 'Chưa bán', value: false },
            ],
            onFilter: (value, record) => record.isSuccessful === value,
        },
        {
            title: 'Số người tham gia',
            dataIndex: 'uniqueBidders',
            key: 'uniqueBidders',
            width: 130,
            render: (count) => (
                <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{count}</div>
                    <div className="text-xs text-gray-500">người</div>
                </div>
            ),
            sorter: (a, b) => a.uniqueBidders - b.uniqueBidders,
        },
        {
            title: 'Số lượt trả giá',
            dataIndex: 'totalBids',
            key: 'totalBids',
            width: 130,
            render: (count) => (
                <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{count}</div>
                    <div className="text-xs text-gray-500">lượt</div>
                </div>
            ),
            sorter: (a, b) => a.totalBids - b.totalBids,
        },
        {
            title: 'Giá cao nhất',
            dataIndex: 'highestPrice',
            key: 'highestPrice',
            width: 150,
            render: (price) => (
                <Text strong className="text-lg text-green-600">
                    {formatCurrency(price)}
                </Text>
            ),
            sorter: (a, b) => a.highestPrice - b.highestPrice,
        },
        {
            title: 'Người thắng cuộc',
            key: 'winner',
            width: 200,
            render: (_, record) => (
                record.winnerInfo ? (
                    <Space direction="vertical" size="small">
                        <Text strong className="text-sm">{record.winnerInfo.name}</Text>
                        <Text type="secondary" className="text-xs">
                            CCCD: {record.winnerInfo.cccd}
                        </Text>
                        <Text className="text-xs text-green-600 font-medium">
                            {formatCurrency(record.winnerInfo.winningPrice)}
                        </Text>
                    </Space>
                ) : (
                    <Text type="secondary" className="text-sm">Chưa có người thắng</Text>
                )
            ),
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <Card className="!mb-6 shadow-sm border-0 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <BarChartOutlined className="text-3xl text-blue-500" />
                        <div>
                            <Title level={2} className="!mb-1 !text-gray-800">
                                Tóm tắt phiên đấu giá
                            </Title>
                            <Text type="secondary" className="text-base">
                                Thống kê tổng quan và kết quả đấu giá chi tiết
                            </Text>
                        </div>
                    </div>
                    <Space size="middle">
                        <Button
                            type="default"
                            size="large"
                            icon={<DownloadOutlined />}
                            onClick={handleDownloadHandbook}
                            loading={downloading}
                            className="!bg-white !border-green-500 !text-green-600 hover:!bg-green-50 hover:!border-green-600 !shadow-md hover:!shadow-lg !transition-all !duration-300 !h-12 !px-6"
                        >
                            {downloading ? 'Đang xử lý...' : 'Chọn template và tải sổ tay'}
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            icon={<ArrowLeftOutlined />}
                            onClick={onBack}
                            className="!bg-gradient-to-r !from-blue-500 !to-blue-600 !border-none !shadow-lg hover:!from-blue-600 hover:!to-blue-700 !transition-all !duration-300 !h-12 !px-8"
                        >
                            Quay lại
                        </Button>
                    </Space>
                </div>
            </Card>

            {/* Statistics Overview - Improved with more meaningful metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
                    <Statistic
                        title={<span className="text-gray-600 font-medium">Người tham gia</span>}
                        value={totalParticipants}
                        prefix={<UserOutlined className="text-blue-500" />}
                        valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
                    />
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
                    <Statistic
                        title={<span className="text-gray-600 font-medium">Tổng tài sản</span>}
                        value={totalAssets}
                        prefix={<HomeOutlined className="text-purple-500" />}
                        valueStyle={{ color: '#722ed1', fontSize: '24px', fontWeight: 'bold' }}
                    />
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
                    <Statistic
                        title={<span className="text-gray-600 font-medium">Đã bán</span>}
                        value={soldAssets}
                        suffix={`/${totalAssets}`}
                        prefix={<CheckCircleOutlined className="text-green-500" />}
                        valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}
                    />
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
                    <Statistic
                        title={<span className="text-gray-600 font-medium">Tổng số tiền thắng đấu giá</span>}
                        value={formatCurrency(totalRevenue)}
                        prefix={<DollarOutlined className="text-orange-500" />}
                        valueStyle={{ color: '#fa8c16', fontSize: '18px', fontWeight: 'bold' }}
                    />
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
                    <Statistic
                        title={<span className="text-gray-600 font-medium">Tổng lượt trả giá</span>}
                        value={totalBidsCount}
                        prefix={<BarChartOutlined className="text-pink-500" />}
                        valueStyle={{ color: '#eb2f96', fontSize: '24px', fontWeight: 'bold' }}
                    />
                </Card>
            </div>

            {/* Enhanced Asset Statistics Table */}
            <Card className="shadow-sm border-0 mb-6">
                <Title level={4} className="!mb-6 !flex !items-center !gap-2 !text-gray-800">
                    <HomeOutlined className="!text-blue-500" />
                    Chi tiết kết quả đấu giá từng tài sản
                </Title>
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <Text className="text-sm text-blue-700">
                        <strong>Hướng dẫn:</strong> Bảng này hiển thị thông tin chi tiết về mỗi tài sản bao gồm
                        số người tham gia, số lượt trả giá và người thắng cuộc. Bạn có thể lọc theo trạng thái.
                    </Text>
                </div>
                <Table
                    columns={assetColumns}
                    dataSource={assetStatsArray}
                    rowKey="tagName"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} tài sản`,
                        pageSizeOptions: ['10', '20', '50'],
                    }}
                    className="custom-table"
                    rowClassName={(record) =>
                        record.isSuccessful ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'
                    }
                    size="small"
                />
            </Card>

            <style>{`
                .custom-table .ant-table-thead > tr > th {
                    background: #f8f9fa;
                    border-bottom: 2px solid #e9ecef;
                    font-weight: 600;
                }
                .custom-table .ant-table-tbody > tr:hover > td {
                    background: #f0f9ff;
                }
            `}</style>
        </div>
    );
};

export default AuctionResults;
