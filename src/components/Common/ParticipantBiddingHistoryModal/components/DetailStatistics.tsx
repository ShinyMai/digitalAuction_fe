import React from "react";
import { Card, Statistic, Row, Col, Typography } from "antd";
import {
  FileTextOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { formatCurrency } from "../utils";
import type { Statistics } from "../types";

const { Text } = Typography;

interface DetailStatisticsProps {
  statistics: Statistics;
}

const DetailStatistics: React.FC<DetailStatisticsProps> = ({ statistics }) => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
          <Text strong style={{ color: "#52c41a", fontSize: "16px" }}>
            Thống kê chi tiết phiên đấu giá
          </Text>
        </div>
        <Text type="secondary" style={{ fontSize: "14px" }}>
          Dữ liệu thống kê từ phiên đấu giá được chọn
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card
            className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500"
            styles={{ body: { padding: "16px" } }}
          >
            <Statistic
              title={
                <span style={{ color: "#1890ff", fontWeight: 500 }}>
                  Tổng số đăng ký
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
              value={statistics.approvedTickets}
              prefix={<TrophyOutlined style={{ color: "#52c41a" }} />}
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
              value={statistics.pendingTickets}
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
            className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-green-500"
            styles={{ body: { padding: "16px" } }}
          >
            <Statistic
              title={
                <span style={{ color: "#52c41a", fontWeight: 500 }}>
                  Cọc đã thanh toán
                </span>
              }
              value={statistics.paidDeposits}
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
              value={statistics.pendingDeposits}
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
              value={statistics.refundedDeposits}
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

export default DetailStatistics;
