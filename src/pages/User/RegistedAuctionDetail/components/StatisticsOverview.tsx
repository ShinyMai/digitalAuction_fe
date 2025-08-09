import React from "react";
import { Card, Row, Col, Tag, Space, Typography, Statistic, Divider } from "antd";
import {
  FileTextOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  FileProtectOutlined,
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
  // Thêm các trường mới
  attendedSessions: number;
  notAttendedSessions: number;
  pendingRefunds: number;
  approvedRefunds: number;
  rejectedRefunds: number;
  documentsWithRefundReason: number;
  documentsWithRefundProof: number;
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

      <Divider />

      {/* Thêm phần thống kê mới cho các trường vừa thêm */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Title level={5}>Tình trạng tham dự đấu giá:</Title>
          <Space wrap>
            <Tag color="green" icon={<UserOutlined />}>
              Đã tham dự: {statistics.attendedSessions}
            </Tag>
            <Tag color="red" icon={<ExclamationCircleOutlined />}>
              Không tham dự: {statistics.notAttendedSessions}
            </Tag>
          </Space>
        </Col>
        <Col xs={24} md={12}>
          <Title level={5}>Trạng thái hoàn cọc:</Title>
          <Space wrap>
            <Tag color="orange" icon={<ClockCircleOutlined />}>
              Chờ xử lý: {statistics.pendingRefunds}
            </Tag>
            <Tag color="green" icon={<CheckCircleOutlined />}>
              Đã chấp nhận: {statistics.approvedRefunds}
            </Tag>
            <Tag color="red" icon={<ExclamationCircleOutlined />}>
              Từ chối: {statistics.rejectedRefunds}
            </Tag>
          </Space>
        </Col>
      </Row>

      <Divider />

      {/* Thống kê tài liệu hoàn cọc */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Title level={5}>Tài liệu hoàn cọc:</Title>
          <Space wrap>
            <Tag color="blue" icon={<FileProtectOutlined />}>
              Có lý do hoàn cọc: {statistics.documentsWithRefundReason}
            </Tag>
            <Tag color="cyan" icon={<FileTextOutlined />}>
              Có minh chứng: {statistics.documentsWithRefundProof}
            </Tag>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default StatisticsOverview;
