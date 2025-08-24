/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Table, Typography, Statistic, Tag, Space, Button } from "antd";
import {
  HomeOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import type { AuctionRoundPriceWinner } from "../modalsData";
import type { ColumnsType } from "antd/es/table";
import { toast } from "react-toastify";
import AuctionServices from "../../../../services/AuctionServices";
import { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";

const { Title, Text } = Typography;

interface AuctionResultsProps {
  auctionID: string;
  auctionRoundPriceWinners: AuctionRoundPriceWinner[];
  onBack: () => void;
}

const AuctionResults = ({
  auctionID,
  auctionRoundPriceWinners,
  onBack,
}: AuctionResultsProps) => {
  const [downloading, setDownloading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  console.log("Iniate value:", auctionRoundPriceWinners)
  // Function to handle direct download without file selection
  const handleDirectDownload = useCallback(async () => {
    setDownloading(true);
    try {
      // Create FormData and append auctionId
      const formData = new FormData();
      formData.append("auctionId", auctionID);

      const response = await AuctionServices.exportHandbook(formData);

      if (response && response.data) {
        // Check if response contains base64 data
        if (
          response.data.base64 &&
          response.data.fileName &&
          response.data.contentType
        ) {
          // Convert base64 to blob
          const base64Data = response.data.base64;
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {
            type: response.data.contentType,
          });

          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = response.data.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toast.success("Tải sổ tay đấu giá thành công!");
        }
        // Fallback: if response contains direct blob data
        else if (response.data instanceof Blob) {
          const url = window.URL.createObjectURL(response.data);
          const link = document.createElement("a");
          link.href = url;
          link.download = `So_tay_dau_gia_${new Date().toISOString().split("T")[0]
            }.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toast.success("Tải sổ tay đấu giá thành công!");
        } else {
          toast.success(response.message || "Xuất file thành công!");
        }
      }
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error("Lỗi khi tải sổ tay: " + (error.message || "Không xác định"));
    } finally {
      setDownloading(false);
    }
  }, [auctionID]);

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  }, []);

  // Calculate comprehensive and accurate statistics using enriched data - Memoized for performance
  const statistics = useMemo(() => {
    const allAssets = new Set(
      auctionRoundPriceWinners.map((item) => item.tagName)
    );
    const winnersData = auctionRoundPriceWinners.filter(
      (item) => item.flagWinner
    );
    const successfulAssets = new Set(winnersData.map((item) => item.tagName));

    // Sum totalBids from assetStatistic data when available
    const totalBidsFromStats = auctionRoundPriceWinners.reduce(
      (sum, item) => sum + (item.assetStatistic?.totalBids || 0), 0
    );

    return {
      totalAssets: allAssets.size,
      soldAssets: successfulAssets.size,
      totalBidsCount: totalBidsFromStats > 0 ? totalBidsFromStats : auctionRoundPriceWinners.length,
      allAssets,
    };
  }, [auctionRoundPriceWinners]);

  // Use enriched data with assetStatistic for detailed statistics - Memoized for performance
  const assetStatsArray = useMemo(() => {
    return Array.from(statistics.allAssets).map(tagName => {
      const assetItem = auctionRoundPriceWinners.find(item => item.tagName === tagName);
      const assetStat = assetItem?.assetStatistic;

      const winner = auctionRoundPriceWinners.find(item => item.tagName === tagName && item.flagWinner);

      return {
        tagName,
        totalBids: assetStat?.totalBids || 0,
        totalBidder: assetStat?.totalParticipants || 0,
        highestPrice: assetStat?.highestPrice || 0,
        startingPrice: assetStat?.startingPrice || 0,
        isSuccessful: !!winner,
        winnerInfo: winner ? {
          name: winner.userName,
          cccd: winner.citizenIdentification,
          winningPrice: winner.auctionPrice,
          time: winner.createdAt,
        } : null,
        // Additional data from assetStatistic
        assetStatistic: assetStat,
      };
    });
  }, [auctionRoundPriceWinners, statistics.allAssets]);

  const assetColumns: ColumnsType<any> = useMemo(() => [
    {
      title: "Tài sản",
      dataIndex: "tagName",
      key: "tagName",
      fixed: "left",
      width: 150,
      render: (text, record) => (
        <Tag
          color={record.isSuccessful ? "green" : "red"}
          className="text-sm font-medium px-3 py-1"
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isSuccessful",
      key: "isSuccessful",
      width: 120,
      render: (isSuccessful) => (
        <Tag
          color={isSuccessful ? "success" : "error"}
          icon={
            isSuccessful ? <CheckCircleOutlined /> : <CloseCircleOutlined />
          }
          className="font-medium"
        >
          {isSuccessful ? "Đã được đấu giá" : "Đấu giá thất bại"}
        </Tag>
      ),
      filters: [
        { text: "Đã được đấu giá", value: true },
        { text: "Đấu giá thất bại", value: false },
      ],
      onFilter: (value, record) => record.isSuccessful === value,
    },
    {
      title: "Số người tham gia",
      dataIndex: "totalBidder",
      key: "totalBidder",
      width: 130,
      render: (count) => (
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{count}</div>
          <div className="text-xs text-gray-500">người</div>
        </div>
      ),
      sorter: (a, b) => a.totalBidder - b.totalBidder,
    },
    {
      title: "Số lượt trả giá",
      dataIndex: "totalBids",
      key: "totalBids",
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
      title: "Giá khởi điểm",
      dataIndex: "startingPrice",
      key: "startingPrice",
      width: 150,
      render: (price) => (
        <Text className="text-lg text-blue-600">
          {formatCurrency(price)}
        </Text>
      ),
      sorter: (a, b) => a.startingPrice - b.startingPrice,
    },
    {
      title: "Giá cao nhất",
      dataIndex: "highestPrice",
      key: "highestPrice",
      width: 150,
      render: (price) => (
        <Text strong className="text-lg text-green-600">
          {formatCurrency(price)}
        </Text>
      ),
      sorter: (a, b) => a.highestPrice - b.highestPrice,
    },
    {
      title: "Người thắng cuộc",
      key: "winner",
      width: 200,
      render: (_, record) =>
        record.winnerInfo ? (
          <Space direction="vertical" size="small">
            <Text strong className="text-sm">
              {record.winnerInfo.name}
            </Text>
            <Text type="secondary" className="text-xs">
              CCCD: {record.winnerInfo.cccd}
            </Text>
            <Text className="text-xs text-green-600 font-medium">
              {formatCurrency(record.winnerInfo.winningPrice)}
            </Text>
          </Space>
        ) : (
          <Text type="secondary" className="text-sm">
            Chưa có người thắng
          </Text>
        ),
    },
  ], [formatCurrency]);

  // Memoized pagination configuration
  const paginationConfig = useMemo(() => ({
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} của ${total} tài sản`,
    pageSizeOptions: ["10", "20", "50"],
  }), []);

  // Memoized row class name function
  const getRowClassName = useCallback((record: any) =>
    record.isSuccessful
      ? "bg-green-50 hover:bg-green-100"
      : "bg-red-50 hover:bg-red-100"
    , []);

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
            {
              user?.roleName === "Manager" || user?.roleName === "Staff" ?
                <Button
                  type="default"
                  size="large"
                  icon={<DownloadOutlined />}
                  onClick={handleDirectDownload}
                  loading={downloading}
                  className="!bg-white !border-green-500 !text-green-600 hover:!bg-green-50 hover:!border-green-600 !shadow-md hover:!shadow-lg !transition-all !duration-300 !h-12 !px-6"
                >
                  {downloading ? "Đang tải..." : "Tải sổ tay"}
                </Button> : <></>
            }

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
          <Statistic
            title={
              <span className="text-gray-600 font-medium">Tổng tài sản</span>
            }
            value={statistics.totalAssets}
            prefix={<HomeOutlined className="text-purple-500" />}
            valueStyle={{
              color: "#722ed1",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          />
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
          <Statistic
            title={<span className="text-gray-600 font-medium">Đã bán</span>}
            value={statistics.soldAssets}
            suffix={`/${statistics.totalAssets}`}
            prefix={<CheckCircleOutlined className="text-green-500" />}
            valueStyle={{
              color: "#52c41a",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          />
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
          <Statistic
            title={
              <span className="text-gray-600 font-medium">
                Tổng lượt trả giá
              </span>
            }
            value={statistics.totalBidsCount}
            prefix={<BarChartOutlined className="text-pink-500" />}
            valueStyle={{
              color: "#eb2f96",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          />
        </Card>
      </div>

      {/* Enhanced Asset Statistics Table */}
      <Card className="shadow-sm border-0 mb-6">
        <Title
          level={4}
          className="!mb-6 !flex !items-center !gap-2 !text-gray-800"
        >
          <HomeOutlined className="!text-blue-500" />
          Chi tiết kết quả đấu giá từng tài sản
        </Title>
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <Text className="text-sm text-blue-700">
            <strong>Hướng dẫn:</strong> Bảng này hiển thị thông tin chi tiết về
            mỗi tài sản bao gồm giá khởi điểm, số người tham gia, số lượt trả giá,
            giá cao nhất và người thắng cuộc. Dữ liệu được tổng hợp
            từ thống kê chi tiết của từng tài sản. Bạn có thể lọc theo trạng thái và sắp xếp theo các tiêu chí khác nhau.
          </Text>
        </div>
        <Table
          columns={assetColumns}
          dataSource={assetStatsArray}
          rowKey="tagName"
          pagination={paginationConfig}
          className="custom-table"
          rowClassName={getRowClassName}
          size="small"
        />
      </Card>

      <style>{`
                .custom-table .ant-table-thead > tr > th {
                    background: #f8f9fa;
                    border-bottom: 2px solid #e9ecef;
                    font-weight: 600;
                }
                /* Fixed column background colors */
                .custom-table .ant-table-tbody > tr.bg-green-50 .ant-table-cell-fix-left {
                    background: #f0fdf4 !important;
                }
                .custom-table .ant-table-tbody > tr.bg-red-50 .ant-table-cell-fix-left {
                    background: #fef2f2 !important;
                }
                
            `}</style>
    </div>
  );
};

export default AuctionResults;
