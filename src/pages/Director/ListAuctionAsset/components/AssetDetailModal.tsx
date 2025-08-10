import React from "react";
import {
  Modal,
  Descriptions,
  Divider,
  Row,
  Col,
  Card,
  Statistic,
  Tag,
  Button,
} from "antd";
import { TagOutlined } from "@ant-design/icons";
import { formatNumber } from "../../../../utils/numberFormat";
import dayjs from "dayjs";
import type { AuctionAsset } from "../types";
import CustomModal from "../../../../components/Common/CustomModal";

interface AssetDetailModalProps {
  visible: boolean;
  asset: AuctionAsset | null;
  onClose: () => void;
}

const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  visible,
  asset,
  onClose,
}) => {
  const formatVND = (amount: number) => {
    return `${formatNumber(amount)} VND`;
  };

  if (!asset) return null;

  return (
    <CustomModal
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <TagOutlined className="text-blue-500" />
          </div>
          <span className="text-xl font-bold">Chi tiết tài sản đấu giá</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={800}
      style={{ top: 20 }}
    >
      <div className="space-y-6">
        <Descriptions
          column={2}
          bordered
          size="middle"
          className="bg-gray-50 rounded-lg"
        >
          <Descriptions.Item label="Tên tài sản" span={2}>
            <span className="font-semibold text-lg">{asset.tagName}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Danh mục">
            <Tag color="blue" className="font-medium">
              {asset.categoryName}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Đơn vị">
            <Tag color="cyan">{asset.unit}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Buổi đấu giá">
            {asset.auctionName}
          </Descriptions.Item>
        </Descriptions>

        <Divider>Thông tin tài chính</Divider>

        <Row gutter={16}>
          <Col span={8}>
            <Card className="text-center bg-green-50 border-green-200">
              <Statistic
                title="Giá khởi điểm"
                value={asset.startingPrice}
                formatter={(value) => formatVND(Number(value))}
                valueStyle={{ color: "#52c41a", fontSize: "18px" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card className="text-center bg-blue-50 border-blue-200">
              <Statistic
                title="Tiền đặt trước"
                value={asset.deposit}
                formatter={(value) => formatVND(Number(value))}
                valueStyle={{ color: "#1890ff", fontSize: "18px" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card className="text-center bg-purple-50 border-purple-200">
              <Statistic
                title="Phí đăng ký"
                value={asset.registrationFee}
                formatter={(value) => formatVND(Number(value))}
                valueStyle={{ color: "#722ed1", fontSize: "18px" }}
              />
            </Card>
          </Col>
        </Row>

        {asset.description && (
          <>
            <Divider>Mô tả</Divider>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                {asset.description}
              </p>
            </div>
          </>
        )}

        <Divider>Thông tin khác</Divider>

        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="Ngày tạo">
            {dayjs(asset.createdAt).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">
            {dayjs(asset.updatedAt).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </CustomModal>
  );
};

export default AssetDetailModal;
