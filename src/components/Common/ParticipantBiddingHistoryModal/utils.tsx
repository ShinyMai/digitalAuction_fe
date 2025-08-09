import { Tag } from "antd";
import {
  SyncOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { RegisteredAuction } from "./types";

// Format currency utility
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Format date utility
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get auction status with better styling
export const getAuctionStatus = (auction: RegisteredAuction) => {
  const now = new Date();
  const registerEnd = new Date(auction.registerEndDate);
  const auctionStart = new Date(auction.auctionStartDate);
  const auctionEnd = new Date(auction.auctionEndDate);

  if (now < registerEnd) {
    return (
      <Tag color="processing" icon={<SyncOutlined spin />}>
        Đang đăng ký
      </Tag>
    );
  } else if (now >= registerEnd && now < auctionStart) {
    return (
      <Tag color="warning" icon={<ClockCircleOutlined />}>
        Chờ đấu giá
      </Tag>
    );
  } else if (now >= auctionStart && now < auctionEnd) {
    return (
      <Tag color="success" icon={<TrophyOutlined />}>
        Đang đấu giá
      </Tag>
    );
  } else {
    return (
      <Tag color="default" icon={<CheckCircleOutlined />}>
        Đã kết thúc
      </Tag>
    );
  }
};

// Get deposit status tag
export const getDepositStatusTag = (status: number) => {
  switch (status) {
    case 1:
      return <Tag color="green">Đã thanh toán</Tag>;
    case 2:
      return <Tag color="orange">Đã hoàn trả</Tag>;
    case 0:
    default:
      return <Tag color="red">Chưa thanh toán</Tag>;
  }
};

// Get ticket status tag
export const getTicketStatusTag = (status: number) => {
  switch (status) {
    case 1:
      return <Tag color="green">Đã duyệt</Tag>;
    case 2:
      return <Tag color="red">Từ chối</Tag>;
    case 0:
    default:
      return <Tag color="blue">Chờ duyệt</Tag>;
  }
};
