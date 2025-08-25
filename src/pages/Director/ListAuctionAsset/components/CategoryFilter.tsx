import React from "react";
import { Card, Badge, Tag } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { CATEGORY_OPTIONS, type CategoryFilterProps } from "../types";

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categoryCounts,
  selectedCategory,
  onCategoryChange,
}) => {
  const totalAssets = Object.values(categoryCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <Card className="!border-0 !shadow-lg !rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <InfoCircleOutlined className="!text-blue-500" />
        <span className="font-semibold text-gray-700">
          Thống kê theo danh mục
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        <Badge
          count={totalAssets}
          style={{ backgroundColor: "#1890ff" }}
          onClick={() => onCategoryChange("all")}
          className="!cursor-pointer"
        >
          <Tag
            color={selectedCategory === undefined ? "blue" : "default"}
            className="!px-3 !py-1 !text-sm cursor-pointer !hover:shadow-md !transition-all"
          >
            Tất cả
          </Tag>
        </Badge>
        {CATEGORY_OPTIONS.map((category) => (
          <Badge
            key={category.id}
            count={categoryCounts[category.name] || 0}
            style={{ backgroundColor: "#52c41a" }}
            onClick={() => onCategoryChange(category.id.toString())}
            className="cursor-pointer"
          >
            <Tag
              color={selectedCategory === category.id ? "blue" : "default"}
              className="!px-3 !py-1 !text-sm cursor-pointer !hover:shadow-md !transition-all"
            >
              {category.name}
            </Tag>
          </Badge>
        ))}
      </div>
    </Card>
  );
};

export default CategoryFilter;
