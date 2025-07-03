/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import type { AuctionCategory } from "../../Modals";

interface Props {
  auctionCategory?: AuctionCategory[];
  onSearch: (searchValue: any) => void;
}

const SearchAuctionTable = ({
  auctionCategory,
  onSearch,
}: Props) => {
  const [form] = useForm();

  const optionSearchbyStatus = [
    { label: "Đang thu hồ sơ", value: "1" },
    { label: "Chuẩn bị đấu giá", value: "2" },
    { label: "Chưa hoàn cọc", value: "3" },
    { label: "Đã hoàn cọc", value: "4" },
  ];

  const dataAuctionCategoryList = auctionCategory?.map(
    (val) => ({
      value: val.categoryId,
      label: val.categoryName,
    })
  );

  const handleSearch = () => {
    form.validateFields().then((values) => {
      onSearch(values);
    });
  };

  return (
    <div className="w-full flex flex-col md:flex-row justify-center items-start md:items-center gap-4">
      <Form
        className="w-full flex flex-row flex-wrap gap-4"
        layout="vertical"
        onFinish={handleSearch}
        form={form}
      >
        <Form.Item
          name="auctionName"
          className="flex-1 min-w-[200px]"
          label="Tên buổi đấu giá"
        >
          <Input
            placeholder="Tên buổi đấu giá"
            className="w-full h-10 rounded-lg"
          />
        </Form.Item>
        <Form.Item
          name="CategoryfeldId"
          className="flex-1 min-w-[200px]"
          label="Loại tài sản"
        >
          <Select
            className="w-full rounded-lg"
            style={{ height: "40px" }}
            placeholder="Danh mục tài sản"
            options={dataAuctionCategoryList}
            onSelect={(val) => console.log(val)}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="AuctionStatus"
          className="flex-1 min-w-[200px]"
          label="Tình trạng buổi đấu giá"
        >
          <Select
            className="w-full rounded-lg"
            style={{ height: "40px" }}
            placeholder="Danh mục tài sản"
            defaultValue={"1"}
            options={optionSearchbyStatus}
            onSelect={(val) => console.log("Check", val)}
            allowClear
          />
        </Form.Item>
        <Form.Item className="flex-1 min-w-[200px] self-end">
          <Button
            type="primary"
            htmlType="submit"
            style={{ height: "40px" }}
            icon={<SearchOutlined />}
            className="rounded-lg flex items-center justify-center"
          >
            Tìm kiếm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SearchAuctionTable;
