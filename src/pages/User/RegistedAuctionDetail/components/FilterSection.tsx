import React from "react";
import { Card, Row, Col, Space, Typography, Select } from "antd";
import { FilterOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface FilterSectionProps {
  depositFilter: number | "all";
  ticketFilter: number | "all";
  setDepositFilter: (value: number | "all") => void;
  setTicketFilter: (value: number | "all") => void;
  filteredCount: number;
  totalCount: number;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  depositFilter,
  ticketFilter,
  setDepositFilter,
  setTicketFilter,
  filteredCount,
  totalCount,
}) => {
  return (
    <Card
      title={
        <>
          <FilterOutlined /> Bộ lọc
        </>
      }
      style={{ marginBottom: "24px" }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Space direction="vertical" style={{ width: "100% " }}>
            <Text strong>Trạng thái xác nhận thanh toán cọc:</Text>
            <Select
              style={{ width: "100% " }}
              value={depositFilter}
              onChange={setDepositFilter}
              options={[
                { value: "all", label: "Tất cả" },
                { value: 1, label: "Xác nhận thanh toán" },
                { value: 0, label: "Chờ xác nhận" },
                { value: 2, label: "Đã hoàn trả" },
              ]}
            />
          </Space>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Space direction="vertical" style={{ width: "100% " }}>
            <Text strong>Trạng thái nhận hồ sơ:</Text>
            <Select
              style={{ width: "100% " }}
              value={ticketFilter}
              onChange={setTicketFilter}
              options={[
                { value: "all", label: "Tất cả" },
                { value: 1, label: "Đã nhận" },
                { value: 0, label: "Chưa nhận" },
              ]}
            />
          </Space>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Space direction="vertical" style={{ width: "100% " }}>
            <Text strong>Tổng số đăng ký hiển thị:</Text>
            <div
              style={{
                padding: "8px 12px",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                backgroundColor: "#fafafa",
              }}
            >
              <Text strong style={{ color: "#1890ff" }}>
                {filteredCount} / {totalCount} đăng ký
              </Text>
            </div>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default FilterSection;
