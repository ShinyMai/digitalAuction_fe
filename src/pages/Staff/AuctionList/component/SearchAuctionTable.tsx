/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";
import { STAFF_ROUTES } from "../../../../routers";
import type { AuctionCategory } from "../../Modals";
import { useSelector } from "react-redux";

interface Props {
  auctionCategory?: AuctionCategory[];
  onSearch: (searchValue: any) => void;
}

const SearchAuctionTable = ({
  auctionCategory,
  onSearch,
}: Props) => {
  const [form] = useForm();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const role = user?.roleName;

  const dataAuctionCategoryList = auctionCategory?.map(
    (val) => ({
      value: val.categoryId,
      label: val.categoryName,
    })
  );

  const onClickAddnew = () => {
    const rolePath = role?.toLowerCase();
    navigate(
      `/${rolePath}/${STAFF_ROUTES.SUB.POST_AUCTION}`
    );
  };

  const handleSearch = () => {
    form.validateFields().then((values) => {
      onSearch(values);
    });
  };

  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <Button
        type="primary"
        htmlType="button"
        icon={<PlusOutlined />}
        className="w-full md:w-auto h-10 px-5 rounded-lg flex items-center justify-center"
        onClick={onClickAddnew}
      >
        Tạo mới
      </Button>
      <Form
        className="w-full md:w-2/3 flex flex-col md:flex-row justify-between gap-4"
        layout="vertical"
        onFinish={handleSearch}
        form={form}
      >
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <Form.Item
            label="Thời gian đăng ký"
            name="registerRangeDate"
          >
            <DatePicker.RangePicker className="w-full h-10 rounded-lg" />
          </Form.Item>
          <Form.Item name="auctionName">
            <Input
              placeholder="Tên buổi đấu giá"
              className="w-full h-10 rounded-lg"
            />
          </Form.Item>
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <Form.Item
            label="Thời gian đấu giá"
            name="auctionRangeDate"
          >
            <DatePicker.RangePicker className="w-full h-10 rounded-lg" />
          </Form.Item>
          <Form.Item name="CategoryId">
            <Select
              className="w-full h-10 rounded-lg"
              placeholder="Danh mục tài sản"
              options={dataAuctionCategoryList}
              onSelect={(val) => console.log(val)}
              allowClear
            />
          </Form.Item>
        </div>
        <Form.Item label=" " className="self-end">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            className="w-full md:w-auto h-10 px-5 rounded-lg flex items-center justify-center"
          >
            Tìm kiếm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SearchAuctionTable;
