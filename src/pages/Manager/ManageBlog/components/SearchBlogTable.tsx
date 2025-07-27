import { Form, Input, Select, Button } from "antd";
import { useForm } from "antd/es/form/Form";
import { SearchOutlined, ClearOutlined, PlusOutlined } from "@ant-design/icons";
import { BlogStatus, BlogStatusOptions } from "../../../Staff/ManageBlog/types";

interface SearchValue {
  searchTitle?: string;
  status?: number;
}

interface Props {
  onSearch: (searchValue: SearchValue) => void;
  onAddNew?: () => void;
}

const SearchBlogTable = ({ onSearch, onAddNew }: Props) => {
  const [form] = useForm();

  const handleFormChange = (
    _changedValues: Record<string, unknown>,
    allValues: Record<string, unknown>
  ) => {
    const searchValue: SearchValue = {
      searchTitle: allValues.searchTitle as string,
      status: allValues.status as number,
    };
    onSearch(searchValue);
  };
  const handleReset = () => {
    form.resetFields();
    form.setFieldsValue({ status: BlogStatus.PUBLISHED });
    onSearch({ status: BlogStatus.PUBLISHED });
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <SearchOutlined className="text-white text-sm" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Tìm kiếm & Lọc bài viết hihi</h3>
        </div>

        {onAddNew && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddNew}
            className="bg-gradient-to-r from-green-500 to-green-600 border-0 rounded-lg font-medium hover:scale-105 transition-transform duration-200"
            size="large"
          >
            Thêm bài viết mới
          </Button>
        )}
      </div>
      <Form className="w-full" layout="vertical" onValuesChange={handleFormChange} form={form}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            name="searchTitle"
            label={<span className="text-gray-700 font-medium">Tiêu đề bài viết</span>}
            className="mb-0"
          >
            <Input
              placeholder="Nhập tiêu đề bài viết..."
              prefix={<SearchOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label={<span className="text-gray-700 font-medium">Trạng thái</span>}
            className="mb-0"
          >
            {" "}
            <Select
              placeholder="Chọn trạng thái"
              className="h-11"
              options={BlogStatusOptions}
              allowClear
              style={{
                borderRadius: "8px",
              }}
            />
          </Form.Item>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="default"
            icon={<ClearOutlined />}
            onClick={handleReset}
            className="px-6 py-2 h-10 rounded-lg border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 font-medium"
          >
            Đặt lại bộ lọc
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SearchBlogTable;
