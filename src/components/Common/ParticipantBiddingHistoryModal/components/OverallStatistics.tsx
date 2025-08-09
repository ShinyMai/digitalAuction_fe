import React from "react";
import { Card, Statistic, Row, Col, Typography, Button } from "antd";
import {
  TrophyOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { formatCurrency } from "../utils";
import type { OverallStatistics } from "../types";

const { Text } = Typography;

interface OverallStatisticsProps {
  statistics: OverallStatistics;
  loading: boolean;
  onRefresh: () => void;
}

const OverallStatisticsComponent: React.FC<OverallStatisticsProps> = ({
  statistics,
  loading,
  onRefresh,
}) => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
              <Text strong style={{ color: "#722ed1", fontSize: "16px" }}>
                Thống kê toàn bộ lịch sử đấu giá
              </Text>
            </div>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              Tổng hợp dữ liệu từ tất cả phiên đấu giá đã tham gia
            </Text>
          </div>
          <Button
            type="primary"
            icon={<SyncOutlined />}
            onClick={onRefresh}
            loading={loading}
            className="bg-gradient-to-r from-purple-500 to-purple-600 border-0"
            style={{ borderRadius: "8px" }}
          >
            Cập nhật thống kê
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {/* Tổng quan chung */}
        <Col span={24}>
          <div className="mb-4">
            <Text strong style={{ color: "#722ed1", fontSize: "14px" }}>
              📊 TỔNG QUAN CHUNG
            </Text>
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-purple-500"
            styles={{ body: { padding: "16px" } }}
          >
            <Statistic
              title={
                <span style={{ color: "#722ed1", fontWeight: 500 }}>
                  Phiên đã tham gia
                </span>
              }
              value={statistics.totalAuctionsParticipated}
              prefix={<TrophyOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{
                color: "#722ed1",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500"
            styles={{ body: { padding: "16px" } }}
          >
            <Statistic
              title={
                <span style={{ color: "#1890ff", fontWeight: 500 }}>
                  Tổng đăng ký
                </span>
              }
              value={statistics.totalRegistrations}
              prefix={<FileTextOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{
                color: "#1890ff",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-green-500"
            styles={{ body: { padding: "16px" } }}
          >
            <Statistic
              title={
                <span style={{ color: "#52c41a", fontWeight: 500 }}>
                  Tỷ lệ thắng
                </span>
              }
              value={statistics.winRate}
              precision={1}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{
                color: "#52c41a",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-red-500"
            styles={{ body: { padding: "16px" } }}
          >
            <Statistic
              title={
                <span style={{ color: "#f5222d", fontWeight: 500 }}>
                  Tổng chi phí
                </span>
              }
              value={statistics.totalAmountSpent}
              formatter={(value) => formatCurrency(Number(value))}
              prefix={<DollarOutlined style={{ color: "#f5222d" }} />}
              valueStyle={{
                color: "#f5222d",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>

        {/* Thống kê phiếu đăng ký */}
        <Col span={24}>
          <div className="mb-4 mt-4">
            <Text strong style={{ color: "#722ed1", fontSize: "14px" }}>
              📋 TRẠNG THÁI PHIẾU ĐĂNG KÝ
            </Text>
          </div>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-green-500"
            styles={{ body: { padding: "16px" } }}
          >
            <Statistic
              title={
                <span style={{ color: "#52c41a", fontWeight: 500 }}>
                  Phiếu đã duyệt
                </span>
              }
              value={statistics.totalApprovedTickets}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{
                color: "#52c41a",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-orange-500"
            styles={{ body: { padding: "16px" } }}
          >
            <Statistic
              title={
                <span style={{ color: "#faad14", fontWeight: 500 }}>
                  Phiếu chờ duyệt
                </span>
              }
              value={statistics.totalPendingTickets}
              prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
              valueStyle={{
                color: "#faad14",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-red-500"
            styles={{ body: { padding: "16px" } }}
          >
            <Statistic
              title={
                <span style={{ color: "#f5222d", fontWeight: 500 }}>
                  Phiếu bị từ chối
                </span>
              }
              value={statistics.totalRejectedTickets}
              prefix={
                <ExclamationCircleOutlined style={{ color: "#f5222d" }} />
              }
              valueStyle={{
                color: "#f5222d",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>

        {/* Thống kê tài chính */}
        <Col span={24}>
          <div className="mb-4 mt-4">
            <Text strong style={{ color: "#722ed1", fontSize: "14px" }}>
              💰 THỐNG KÊ TÀI CHÍNH
            </Text>
          </div>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-red-500"
            styles={{ body: { padding: "16px" } }}
          >
            <Statistic
              title={
                <span style={{ color: "#f5222d", fontWeight: 500 }}>
                  Tổng tiền cọc
                </span>
              }
              value={statistics.totalDeposit}
              formatter={(value) => formatCurrency(Number(value))}
              prefix={<DollarOutlined style={{ color: "#f5222d" }} />}
              valueStyle={{
                color: "#f5222d",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-purple-500"
            styles={{ body: { padding: "16px" } }}
          >
            <Statistic
              title={
                <span style={{ color: "#722ed1", fontWeight: 500 }}>
                  Tổng phí đăng ký
                </span>
              }
              value={statistics.totalRegistrationFee}
              formatter={(value) => formatCurrency(Number(value))}
              prefix={<DollarOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{
                color: "#722ed1",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500"
            styles={{ body: { padding: "16px" } }}
          >
            <Statistic
              title={
                <span style={{ color: "#1890ff", fontWeight: 500 }}>
                  TB cọc/lần đăng ký
                </span>
              }
              value={statistics.averageDepositPerRegistration}
              formatter={(value) => formatCurrency(Number(value))}
              prefix={<DollarOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{
                color: "#1890ff",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>

        {/* Thống kê trạng thái cọc */}
        <Col span={24}>
          <div className="mb-4 mt-4">
            <Text strong style={{ color: "#722ed1", fontSize: "14px" }}>
              🏦 TRẠNG THÁI TIỀN CỌC
            </Text>
          </div>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-green-500"
            styles={{ body: { padding: "16px" } }}
          >
            <Statistic
              title={
                <span style={{ color: "#52c41a", fontWeight: 500 }}>
                  Cọc đã thanh toán
                </span>
              }
              value={statistics.totalPaidDeposits}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{
                color: "#52c41a",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-red-500"
            styles={{ body: { padding: "16px" } }}
          >
            <Statistic
              title={
                <span style={{ color: "#f5222d", fontWeight: 500 }}>
                  Cọc chưa thanh toán
                </span>
              }
              value={statistics.totalPendingDeposits}
              prefix={
                <ExclamationCircleOutlined style={{ color: "#f5222d" }} />
              }
              valueStyle={{
                color: "#f5222d",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-orange-500"
            styles={{ body: { padding: "16px" } }}
          >
            <Statistic
              title={
                <span style={{ color: "#faad14", fontWeight: 500 }}>
                  Cọc đã hoàn trả
                </span>
              }
              value={statistics.totalRefundedDeposits}
              prefix={<DollarOutlined style={{ color: "#faad14" }} />}
              valueStyle={{
                color: "#faad14",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OverallStatisticsComponent;
