import { Tag } from "antd";
import {
  SyncOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { RegisteredAuction } from "./types";

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getAuctionStatus = (auction: RegisteredAuction) => {
  const now = new Date();
  const registerEnd = new Date(auction.registerEndDate);
  const auctionStart = new Date(auction.auctionStartDate);
  const auctionEnd = new Date(auction.auctionEndDate);

  if (now < registerEnd) {
    return (
      <Tag color="processing" icon={<SyncOutlined spin />}>
        Đang trong thời gian đăng ký
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
      return <Tag color="green">Đã cọc</Tag>;
    case 2:
      return <Tag color="orange">Đã hoàn trả</Tag>;
    case 0:
    default:
      return <Tag color="red">Chưa cọc</Tag>;
  }
};

// Get ticket status tag
export const getTicketStatusTag = (status: number) => {
  switch (status) {
    case 1:
      return <Tag color="blue">Đã chuyển tiền</Tag>;
    case 2:
      return <Tag color="green">Đã nhận phiếu</Tag>;
    case 3:
      return <Tag color="red">Đã hoàn tiền hồ sơ</Tag>;
    case 4:
      return <Tag color="red">Từ chối nhận phiếu</Tag>;
    case 0:
    default:
      return <Tag color="gray">Chưa chuyển</Tag>;
  }
};
