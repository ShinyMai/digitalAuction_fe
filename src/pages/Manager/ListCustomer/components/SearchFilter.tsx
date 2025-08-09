import React from "react";
import { Card, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface SearchFilterProps {
  search: string;
  setSearch: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  search,
  setSearch,
  onSearch,
  onReset,
}) => {
  return (
    <Card className="!mb-6 !shadow-lg !rounded-xl !border-0">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm
          </label>
          <Input
            placeholder="Tìm theo tên, email, số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<SearchOutlined className="text-gray-400" />}
            className="h-12 rounded-lg"
            onPressEnter={onSearch}
          />
        </div>
        <div className="flex gap-2 items-end ml-2 pb-1">
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={onSearch}
            className="h-12 px-6 bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            Tìm kiếm
          </Button>
          <Button onClick={onReset} className="h-12 px-6 rounded-lg">
            Đặt lại
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SearchFilter;
