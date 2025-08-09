/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import type { AuctionCategory } from "../../Modals";

interface Props {
  auctionCategory?: AuctionCategory[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSearch: (searchValue: any) => void;
}

const SearchAuctionTable = ({ auctionCategory, onSearch }: Props) => {
  const [form] = useForm();

  const dataAuctionCategoryList = auctionCategory?.map((val) => ({
    value: val.categoryId,
    label: val.categoryName,
  }));

  const optionSearchbyType = [
    { label: "Đấu giá từng tài sản", value: "1" },
    { label: "Đấu giá theo lô", value: "2" },
  ];

  const handleFormChange = (_changedValues: any, allValues: any) => {
    onSearch(allValues);
  };

  return (
    <div className="w-full flex flex-col md:flex-row justify-center items-start md:items-center gap-4">
      <Form
        className="w-full flex flex-row flex-wrap gap-4"
        layout="vertical"
        form={form}
        onValuesChange={handleFormChange}
      >
        <Form.Item name="auctionName" className="flex-1 min-w-[200px]" label="Tên buổi đấu giá">
          <Input placeholder="Tên buổi đấu giá" className="w-full h-10 rounded-lg" />
        </Form.Item>
        <Form.Item name="CategoryId" className="flex-1 min-w-[200px]" label="Loại tài sản">
          <Select
            className="w-full rounded-lg"
            style={{ height: "40px" }}
            placeholder="Danh mục tài sản"
            options={dataAuctionCategoryList}
            onSelect={(val) => console.log(val)}
            allowClear
          />
        </Form.Item>
        <Form.Item name="AuctionType" className="flex-1 min-w-[200px]" label="Loại đấu giá">
          <Select
            className="w-full rounded-lg"
            style={{ height: "40px" }}
            placeholder="Loại đấu giá"
            defaultValue={"1"}
            options={optionSearchbyType}
            onSelect={(val) => console.log("Check", val)}
            allowClear
          />
        </Form.Item>

      </Form>
    </div>
  );
};

export default SearchAuctionTable;
