import React from "react";
import { Typography } from "antd";

const { Text } = Typography;

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-lg">
      <div className="text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            {icon}
          </div>
        </div>
        <Text strong style={{ fontSize: "18px", color: "#595959" }}>
          {title}
        </Text>
        <div className="mt-3">
          <Text type="secondary" style={{ fontSize: "14px" }}>
            {description}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
