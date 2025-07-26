/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Button,
  Table,
  Typography,
  Badge,
  Empty,
  Input,
  Pagination,
} from "antd";
import {
  TrophyOutlined,
  DollarOutlined,
  CalendarOutlined,
  FileTextOutlined,
  CrownOutlined,
  GiftOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { formatNumber } from "../../../../utils/numberFormat";
import { removeVietnameseAccents, searchWithoutAccents } from "../../../../utils/removeAccents";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import AuctionServices from "../../../../services/AuctionServices";
import { toast } from "react-toastify";

const { Title } = Typography;

interface HighestBid {
  price: number;
  citizenIdentification: string | null;
  name: string | null;
}

interface AuctionAsset {
  highestBid: HighestBid | null;
  auctionAssetsId: string;
  tagName: string;
  startingPrice: number;
  unit: string;
  deposit: number;
  registrationFee: number;
  description: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  auctionId: string;
  auction: any;
}

interface AuctionResultData {
  totalItems: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  items: AuctionAsset[];
}

interface Props {
  auctionId: string;
  auctionTitle?: string;
  auctionEndDate?: string;
  auctionStartDate?: string;
  onBack?: () => void;
}

const AuctionResultsDetail: React.FC<Props> = ({
  auctionId,
  auctionTitle,
  auctionEndDate,
  auctionStartDate,
  onBack,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [resultData, setResultData] = useState<AuctionResultData>({
    totalItems: 0,
    totalPages: 1,
    pageNumber: 1,
    pageSize: 10,
    items: [],
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tagNameFilter, setTagNameFilter] = useState<string>("");
  const [clientSearchTerm, setClientSearchTerm] = useState<string>("");

  const filteredItems = React.useMemo(() => {
    if (!clientSearchTerm.trim()) {
      return resultData.items;
    }

    return resultData.items.filter(
      (item) =>
        searchWithoutAccents(clientSearchTerm, item.tagName) ||
        searchWithoutAccents(clientSearchTerm, item.description || "") ||
        searchWithoutAccents(clientSearchTerm, item.unit || "")
    );
  }, [resultData.items, clientSearchTerm]);

  // Fetch auction results from API
  const fetchAuctionResults = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        pageNumber: currentPage,
        pageSize: 10,
      };

      if (tagNameFilter.trim()) {
        params.tagName = tagNameFilter.trim();
      }

      const response = await AuctionServices.getResultAuctionDetail(auctionId, params);

      if (response.data) {
        setResultData(response.data);
      }
    } catch (error) {
      console.error("Error fetching auction results:", error);
      toast.error("Lỗi khi tải kết quả đấu giá!");
    } finally {
      setLoading(false);
    }
  }, [auctionId, currentPage, tagNameFilter]);

  useEffect(() => {
    fetchAuctionResults();
  }, [fetchAuctionResults]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleTagNameSearch = (value: string) => {
    const normalizedValue = removeVietnameseAccents(value);
    setTagNameFilter(normalizedValue);
    setClientSearchTerm(value);
    setCurrentPage(1);
  };

  const calculateStats = () => {
    const totalStartingValue = resultData.items.reduce((sum, item) => sum + item.startingPrice, 0);
    const totalHighestBid = resultData.items.reduce(
      (sum, item) => sum + (item.highestBid?.price || item.startingPrice),
      0
    );
    const soldItems = resultData.items.filter((item) => item.highestBid !== null).length;
    const unsoldItems = resultData.items.length - soldItems;

    return {
      totalStartingValue,
      totalHighestBid,
      soldItems,
      unsoldItems,
      successRate: resultData.items.length > 0 ? (soldItems / resultData.items.length) * 100 : 0,
    };
  };

  const stats = calculateStats();

  const columns = [
    {
      title: "Tài sản",
      dataIndex: "tagName",
      key: "tagName",
      render: (tagName: string, record: AuctionAsset) => (
        <div className="flex items-center gap-3">
          <div>
            <div className="font-semibold text-gray-800">{tagName}</div>
            <div className="text-sm text-gray-500">{record.unit}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Giá khởi điểm",
      dataIndex: "startingPrice",
      key: "startingPrice",
      render: (price: number) => (
        <div className="text-right">
          <div className="font-medium text-gray-700">{formatNumber(price)} VNĐ</div>
        </div>
      ),
    },
    {
      title: "Giá cao nhất",
      dataIndex: "highestBid",
      key: "highestBid",
      render: (highestBid: HighestBid | null, record: AuctionAsset) => (
        <div className="text-right">
          {highestBid ? (
            <div>
              <div className="font-bold text-green-600 flex items-center justify-end gap-1">
                <TrophyOutlined className="text-yellow-500" />
                {formatNumber(highestBid.price)} VNĐ
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Giá khởi điểm: {formatNumber(record.startingPrice)} VNĐ
              </div>
            </div>
          ) : (
            <div>
              <Tag color="red" className="font-medium">
                Không có người đấu giá
              </Tag>
              <div className="text-xs text-gray-500 mt-1">
                Giá khởi điểm: {formatNumber(record.startingPrice)} VNĐ
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Kết quả",
      key: "result",
      render: (record: AuctionAsset) => (
        <div className="text-right">
          {record.highestBid ? (
            <div className="space-y-2">
              <Badge
                status="success"
                text={<span className="font-medium text-green-600">Đấu giá thành công</span>}
              />
              <div className="text-xs text-gray-500">
                Tăng {formatNumber(record.highestBid.price - record.startingPrice)} VNĐ
              </div>
            </div>
          ) : (
            <Badge
              status="error"
              text={<span className="font-medium text-red-600">Không thành công</span>}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-200/20 rounded-full blur-xl animate-float"></div>
        <div
          className="absolute top-40 right-32 w-32 h-32 bg-purple-200/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/3 w-28 h-28 bg-indigo-200/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        {/* Enhanced Header */}
        <div className="text-center mb-12 animate-slide-in-up">
          <div className="inline-block p-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-6">
            <div className="bg-white px-6 py-2 rounded-xl">
              <span className="text-sm font-semibold text-transparent bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text">
                🏆 KẾT QUẢ ĐẤU GIÁ
              </span>
            </div>
          </div>{" "}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 bg-clip-text mb-4">
            {auctionTitle}
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <CalendarOutlined />
              <span>Bắt đầu: {dayjs(auctionStartDate).format("DD/MM/YYYY HH:mm")}</span>
            </div>
            <div className="hidden sm:block text-gray-400">•</div>
            <div className="flex items-center gap-2">
              <CalendarOutlined />
              <span>Kết thúc: {dayjs(auctionEndDate).format("DD/MM/YYYY HH:mm")}</span>
            </div>
          </div>
        </div>
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl overflow-hidden">
            <Statistic
              title={
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <GiftOutlined className="text-blue-500" />
                  Tổng tài sản
                </span>
              }
              value={resultData.totalItems}
              suffix="tài sản"
              valueStyle={{ color: "#3b82f6", fontSize: "24px", fontWeight: "bold" }}
            />
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl overflow-hidden">
            <Statistic
              title={
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <TrophyOutlined className="text-green-500" />
                  Đấu giá thành công
                </span>
              }
              value={stats.soldItems}
              suffix={`/ ${resultData.totalItems}`}
              valueStyle={{ color: "#10b981", fontSize: "24px", fontWeight: "bold" }}
            />
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl overflow-hidden">
            <Statistic
              title={
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <StarOutlined className="text-purple-500" />
                  Tỷ lệ thành công
                </span>
              }
              value={stats.successRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: "#8b5cf6", fontSize: "24px", fontWeight: "bold" }}
            />
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl overflow-hidden">
            <Statistic
              title={
                <span className="text-gray-600 font-medium flex items-center gap-2">
                  <DollarOutlined className="text-orange-500" />
                  Tổng giá trị
                </span>
              }
              value={stats.totalHighestBid}
              formatter={(value) => `${formatNumber(Number(value))} VNĐ`}
              valueStyle={{ color: "#f59e0b", fontSize: "20px", fontWeight: "bold" }}
            />
          </Card>
        </div>
        {/* Results Summary */}
        <div className="mb-8">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <Title level={3} className="mb-0 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <CrownOutlined className="text-white" />
                </div>
                Tóm tắt kết quả
              </Title>
            </div>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} lg={6}>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatNumber(stats.totalStartingValue)} VNĐ
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Tổng giá khởi điểm</div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">
                    {formatNumber(stats.totalHighestBid)} VNĐ
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Tổng giá trị đạt được</div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatNumber(stats.totalHighestBid - stats.totalStartingValue)} VNĐ
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Tăng giá trị</div>
                </div>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.successRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Tỷ lệ thành công</div>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
        {/* Detailed Results Table */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <Title level={3} className="mb-0 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileTextOutlined className="text-white" />
              </div>
              Chi tiết kết quả đấu giá
            </Title>
          </div>{" "}
          {/* Tag Name Filter */}
          <div className="mb-4">
            <Input.Search
              placeholder="Tìm theo tên tài sản (hỗ trợ tìm kiếm không dấu - VD: 'xe tai' tìm 'xe tải')"
              allowClear
              size="large"
              onSearch={handleTagNameSearch}
              onChange={(e) => setClientSearchTerm(e.target.value)}
              value={clientSearchTerm}
            />
            {clientSearchTerm && (
              <div className="mt-2 text-sm text-gray-500">
                Tìm thấy {filteredItems.length} kết quả cho "{clientSearchTerm}"
              </div>
            )}
          </div>
          {filteredItems.length > 0 ? (
            <Table
              columns={columns}
              dataSource={filteredItems}
              rowKey="auctionAssetsId"
              loading={loading}
              pagination={false}
              className="custom-table"
              scroll={{ x: "max-content" }}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-gray-500 text-lg">Không có dữ liệu kết quả đấu giá</span>
              }
            />
          )}
          {/* Pagination */}
          {resultData.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                current={currentPage}
                total={resultData.totalItems}
                pageSize={10}
                onChange={handlePageChange}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => (
                  <span className="text-gray-600 font-medium">
                    Hiển thị {range[0]}-{range[1]} / {total} tài sản
                  </span>
                )}
                className="[&_.ant-pagination-item]:bg-gradient-to-r [&_.ant-pagination-item]:from-blue-50 [&_.ant-pagination-item]:to-purple-50 [&_.ant-pagination-item]:border-blue-200 [&_.ant-pagination-item]:hover:border-blue-400 [&_.ant-pagination-item-active]:from-blue-500 [&_.ant-pagination-item-active]:to-purple-600 [&_.ant-pagination-item-active]:text-white [&_.ant-pagination-item-active]:border-blue-500"
              />
            </div>
          )}
        </Card>
        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-12">
          {onBack && (
            <Button
              type="default"
              size="large"
              onClick={onBack}
              className="px-8 py-2 h-auto rounded-xl"
            >
              Quay lại danh sách
            </Button>
          )}
        </div>
      </div>

      <style>{`
        .custom-table .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
          border-bottom: 2px solid #e2e8f0 !important;
          font-weight: 600 !important;
          color: #374151 !important;
        }
        
        .custom-table .ant-table-tbody > tr:hover > td {
          background: #f8fafc !important;
        }
        
        .custom-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f1f5f9 !important;
          padding: 16px 12px !important;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-slide-in-up {
          animation: slideInUp 0.6s ease-out forwards;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AuctionResultsDetail;
