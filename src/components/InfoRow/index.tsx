// import { Tag } from "antd";
// import { getColorByStatus } from "../../utils/getColorByStatus";
import React from "react";

interface InfoRowProps {
  label: string;
  value: string | number | React.ReactNode;
  isTag?: boolean;
  color?: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  //   isTag = false,
  color,
}) => {
  return (
    <div className="flex flex-row gap-24 items-start">
      <span className="w-28 font-medium text-gray-600">
        {label}
      </span>
      {/* {isTag ? (
        <Tag color={getColorByStatus(value)}>{value}</Tag>
      ) : ( */}
      <strong
        className="max-w-[330px] font-semibold text-gray-800"
        style={{ color }}
      >
        {value}
      </strong>
      {/* )} */}
    </div>
  );
};
