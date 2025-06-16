import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Table, type TableProps } from "antd";
import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";
import { ROUTERCOMPANY } from "../../../../routers";
import type { AuctionDataList } from "../Modals";

interface props {
    AuctionData?: AuctionDataList[];
    onSearch: (searchvalue: any) => void;
    onSort: (column: string, order: "ascend" | "descend" | undefined) => void;
}

const AcutionTable = ({ AuctionData, onSearch, onSort }: props) => {
    const [form] = useForm();
    const navigate = useNavigate();

    const columns: TableProps<AuctionDataList>["columns"] = [
        {
            title: "Số thứ tự",
            key: "index",
            render: (text: any, record: any, index: number) => index + 1, // Tạo số thứ tự từ 1
        },
        {
            title: "Tên Đấu Giá",
            dataIndex: "auctionName",
            key: "auctionName",
            sorter: true,
        },
        {
            title: "Ngày ĐK Mở",
            dataIndex: "registerOpenDate",
            key: "registerOpenDate",
            sorter: true,
            render: (text: string) => new Date(text).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
        },
        {
            title: "Ngày ĐK Kết Thúc",
            dataIndex: "registerEndDate",
            key: "registerEndDate",
            sorter: true,
            render: (text: string) => new Date(text).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
        },
        {
            title: "Ngày Bắt Đầu",
            dataIndex: "auctionStartDate",
            key: "auctionStartDate",
            sorter: true,
            render: (text: string) => new Date(text).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
        },
        {
            title: "Ngày Kết Thúc",
            dataIndex: "auctionEndDate",
            key: "auctionEndDate",
            sorter: true,
            render: (text: string) => new Date(text).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
        },
        {
            title: "Người tạo",
            dataIndex: "createdByUserName",
            key: "createdByUserName",
            sorter: true,
        },
    ];

    const handleSearch = () => {
        form.validateFields().then((values) => {
            onSearch(values); // Truyền giá trị tìm kiếm lên component cha
        });
    };

    const onClickAddnew = () => {
        navigate(ROUTERCOMPANY.PATH + `/` + ROUTERCOMPANY.SUB.POST_AUCTION);
    };

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        const column = sorter.field; // Tên cột (dataIndex)
        const order = sorter.order; // Trạng thái sắp xếp: "ascend", "descend", hoặc undefined
        onSort(column, order); // Gọi hàm onSort từ props
    };

    return (
        <div className="w-full h-full">
            <div className="w-full h-1/5 flex items-center justify-between">
                <Button
                    type="primary"
                    htmlType="button"
                    icon={<PlusOutlined />}
                    style={{ height: 40, padding: "0 20px" }}
                    className="rounded-lg flex items-center"
                    onClick={onClickAddnew}
                >
                    Tạo mới
                </Button>
                <Form
                    className="flex w-2/3 justify-between"
                    layout="vertical"
                    onFinish={handleSearch}
                    form={form}
                >
                    <Form.Item label="Tên Đấu Giá 1" name="aution-name">
                        <Input
                            placeholder="Tìm kiếm theo auction name!"
                            style={{ width: 250, height: 40 }}
                            className="rounded-lg"
                        />
                    </Form.Item>
                    <Form.Item label="Tên Đấu Giá 2" name="id">
                        <Input
                            placeholder="Tìm kiếm theo auction name!"
                            style={{ width: 250, height: 40 }}
                            className="rounded-lg"
                        />
                    </Form.Item>
                    <Form.Item label="  ">
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SearchOutlined />}
                            style={{ height: 40, padding: "0 20px" }}
                            className="rounded-lg flex items-center"
                        >
                            Tìm kiếm
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div>
                <Table<AuctionDataList>
                    columns={columns}
                    dataSource={AuctionData}
                    onChange={handleTableChange}
                />
            </div>
        </div>
    );
};

export default AcutionTable;