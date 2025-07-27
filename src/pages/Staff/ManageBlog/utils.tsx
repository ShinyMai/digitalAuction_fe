import { Tag } from "antd";
import { getBlogStatusColor, getBlogStatusLabel } from "./types";

export const getBlogStatusTag = (status: number) => {
  return (
    <Tag color={getBlogStatusColor(status)} className="px-3 py-1 text-sm font-medium">
      {getBlogStatusLabel(status)}
    </Tag>
  );
};
