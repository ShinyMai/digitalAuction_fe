import React from "react";
import {
  Card,
  Input,
  Button,
  Radio,
  Form,
  Select,
  DatePicker,
  Space,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  TableOutlined,
  AppstoreOutlined,
  BarsOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import {
  AUCTION_STATUS_OPTIONS,
  CATEGORY_OPTIONS,
  type SearchFilterProps,
} from "../types";

const { Option } = Select;

const SearchFilter: React.FC<SearchFilterProps> = ({
  showFilters,
  viewMode,
  form,
  onSearch,
  onShowFiltersChange,
  onViewModeChange,
  onAdvancedFilter,
  onReset,
}) => {
  return (
    <Card className="!border-0 !shadow-lg !rounded-xl">
      <div className="space-y-4">
        {/* Main Search and View Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input.Search
              size="large"
              placeholder="Tìm kiếm theo tên tài sản..."
              allowClear
              onSearch={onSearch}
              className="w-full"
              enterButton={
                <Button
                  type="primary"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <SearchOutlined />
                </Button>
              }
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              icon={<FilterOutlined />}
              onClick={() => onShowFiltersChange(!showFilters)}
              className={`h-10 ${
                showFilters ? "border-blue-500 text-blue-500" : ""
              }`}
            >
              Bộ lọc
            </Button>
            <Radio.Group
              value={viewMode}
              onChange={(e) => onViewModeChange(e.target.value)}
              className="hidden sm:flex"
            >
              <Radio.Button value="table">
                <TableOutlined />
              </Radio.Button>
              <Radio.Button value="grid">
                <AppstoreOutlined />
              </Radio.Button>
              <Radio.Button value="list">
                <BarsOutlined />
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
            <Form
              form={form}
              layout="vertical"
              onFinish={onAdvancedFilter}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
            >
              <Form.Item name="categoryId" label="Danh mục">
                <Select placeholder="Chọn danh mục" allowClear>
                  {CATEGORY_OPTIONS.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="tagName" label="Tên tài sản">
                <Input placeholder="Nhập tên tài sản" />
              </Form.Item>
              <Form.Item name="auctionStartDate" label="Ngày bắt đầu">
                <DatePicker
                  className="w-full"
                  format="YYYY-MM-DD"
                  placeholder="Chọn ngày bắt đầu"
                />
              </Form.Item>
              <Form.Item name="auctionEndDate" label="Ngày kết thúc">
                <DatePicker
                  className="w-full"
                  format="YYYY-MM-DD"
                  placeholder="Chọn ngày kết thúc"
                />
              </Form.Item>
              <Form.Item name="auctionStatus" label="Trạng thái">
                <Select placeholder="Chọn trạng thái" allowClear>
                  {AUCTION_STATUS_OPTIONS.map((status) => (
                    <Option key={status.value} value={status.value}>
                      {status.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label=" " className="mb-0">
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-blue-500"
                  >
                    Áp dụng
                  </Button>
                  <Button icon={<ClearOutlined />} onClick={onReset}>
                    Đặt lại
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SearchFilter;
