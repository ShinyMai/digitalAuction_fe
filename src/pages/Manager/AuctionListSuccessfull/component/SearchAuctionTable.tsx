/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import type { AuctionCategory } from "../../Modals";

interface Props {
  auctionCategory?: AuctionCategory[];
  onSearch: (searchValue: any) => void;
}

const SearchAuctionTable = ({ auctionCategory, onSearch }: Props) => {
  const [form] = useForm();

  const dataAuctionCategoryList = auctionCategory?.map((val) => ({
    value: val.categoryId,
    label: val.categoryName,
  }));

  const handleFormChange = (_changedValues: any, allValues: any) => {
    onSearch(allValues);
  };

  return (
    <div className="w-full flex flex-col md:flex-row justify-center items-start md:items-center gap-4">
      <Form
        className="w-full flex flex-row flex-wrap gap-4"
        layout="vertical"
        onValuesChange={handleFormChange}
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
          name="CategoryId"
          className="flex-1 min-w-[200px]"
          label="Loại tài sản"
        >
          <Select
            className="w-full rounded-lg"
            style={{ height: "40px" }}
            placeholder="Danh mục tài sản"
            options={dataAuctionCategoryList}
            allowClear
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default SearchAuctionTable;
