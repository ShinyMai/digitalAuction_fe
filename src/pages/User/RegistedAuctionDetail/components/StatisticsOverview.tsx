import React from "react";
import { Card, Row, Col, Tag, Space, Typography, Statistic, Divider } from "antd";
import {
  FileTextOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { formatNumber } from "../../../../utils/numberFormat";

const { Title } = Typography;

interface StatisticsData {
  totalDocuments: number;
  totalDeposit: number;
  totalRegistrationFee: number;
  paidDeposits: number;
  pendingDeposits: number;
  refundedDeposits: number;
  approvedTickets: number;
  pendingTickets: number;
}

interface StatisticsOverviewProps {
  statistics: StatisticsData;
}

const StatisticsOverview: React.FC<StatisticsOverviewProps> = ({ statistics }) => {
  return (
    <Card title="Tổng quan đăng ký tham gia" style={{ marginBottom: "24px " }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Statistic
            title="Tổng số đăng ký"
            value={statistics.totalDocuments}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: "#1890ff " }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Statistic
            title="Tổng tiền đặt cọc"
            value={statistics.totalDeposit}
            formatter={(value) => formatNumber(Number(value))}
            suffix="VNĐ"
            prefix={<DollarOutlined />}
            valueStyle={{ color: "#52c41a " }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Statistic
            title="Tổng phí đăng ký"
            value={statistics.totalRegistrationFee}
            formatter={(value) => formatNumber(Number(value))}
            suffix="VNĐ"
            prefix={<DollarOutlined />}
            valueStyle={{ color: "#fa8c16 " }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Statistic
            title="Đăng ký đã duyệt"
            value={statistics.approvedTickets}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: "#52c41a " }}
          />
        </Col>
      </Row>

      <Divider />

      {/* Status breakdown */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Title level={5}>Trạng thái thanh toán cọc:</Title>
          <Space wrap>
            <Tag color="green" icon={<CheckCircleOutlined />}>
              Xác nhận thanh toán: {statistics.paidDeposits}
            </Tag>
            <Tag color="orange" icon={<ClockCircleOutlined />}>
              Chờ xác nhận: {statistics.pendingDeposits}
            </Tag>
            <Tag color="blue" icon={<DollarOutlined />}>
              Đã hoàn trả: {statistics.refundedDeposits}
            </Tag>
          </Space>
        </Col>
        <Col xs={24} md={12}>
          <Title level={5}>Trạng thái duyệt đăng ký:</Title>
          <Space wrap>
            <Tag color="green" icon={<CheckCircleOutlined />}>
              Đã nhận: {statistics.approvedTickets}
            </Tag>
            <Tag color="orange" icon={<ClockCircleOutlined />}>
              Chưa nhận: {statistics.pendingTickets}
            </Tag>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default StatisticsOverview;
