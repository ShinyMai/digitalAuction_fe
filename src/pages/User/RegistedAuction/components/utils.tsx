import {
  ClockCircleOutlined,
  FireOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import type { RegisteredAuction, StatusInfo, StatusString } from "../types";

export const getStatusString = (auction: RegisteredAuction): StatusString => {
  const now = dayjs();
  const auctionStart = dayjs(auction.auctionStartDate);
  const auctionEnd = dayjs(auction.auctionEndDate);
  const registerEnd = dayjs(auction.registerEndDate);

  if (auction.status === 3) {
    return "cancelled";
  } else if (auction.status === 2) {
    return "completed";
  } else if (now.isBefore(registerEnd)) {
    return "registration";
  } else if (now.isBefore(auctionStart)) {
    return "upcoming";
  } else if (now.isBetween(auctionStart, auctionEnd, "day", "[]")) {
    return "ongoing";
  } else {
    return "completed";
  }
};

export const getStatusInfo = (auction: RegisteredAuction): StatusInfo => {
  const statusString = getStatusString(auction);
  switch (statusString) {
    case "registration":
      return {
        color: "cyan",
        icon: <ClockCircleOutlined />,
        text: "Đang đăng ký",
        bgColor: "bg-cyan-50",
        borderColor: "border-cyan-200",
      };
    case "upcoming":
      return {
        color: "blue",
        icon: <ClockCircleOutlined />,
        text: "Sắp diễn ra",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };
    case "ongoing":
      return {
        color: "orange",
        icon: <FireOutlined />,
        text: "Đang diễn ra",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      };
    case "completed":
      return {
        color: "green",
        icon: <CheckCircleOutlined />,
        text: "Đã kết thúc",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    case "cancelled":
      return {
        color: "red",
        icon: <CloseCircleOutlined />,
        text: "Đã hủy",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    default:
      return {
        color: "default",
        icon: <ExclamationCircleOutlined />,
        text: "Không xác định",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
      };
  }
};
