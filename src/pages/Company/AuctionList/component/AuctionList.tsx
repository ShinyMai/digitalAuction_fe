import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Table, type TableProps } from "antd";
import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";
import { ROUTERCOMPANY } from "../../../../routers";

interface props {
    AuctionData: any[],
    onSearch: (searchvalue: any) => void,
}

interface AuctionDataType {
    id: string;
    Auction_Name: string;
    //Auction_Category_id: number;
    //Auction_description: string;
    //Auction_Rules: string;
    //Auction_Planning_Map: string;
    Register_open_date: string;
    Register_end_date: string;
    Auction_start_date: string;
    Auction_end_date: string;
    //CreateBy: string;
    // CreateAt: string;
    //UpdateBy: string;
    //UpdateAt: string;
    //Or_link: string;
    Number_round_max: number;
    Status: string;
    //Winner_data: string;
}

const AcutionList = ({ AuctionData, onSearch }: props) => {
    const [form] = useForm()
    const navigate = useNavigate()
    const columns: TableProps<AuctionDataType>['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên Đấu Giá',
            dataIndex: 'Auction_Name',
            key: 'Auction_Name',
        },
        // {
        //     title: 'Danh Mục ID',
        //     dataIndex: 'Auction_Category_id',
        //     key: 'Auction_Category_id',
        // },
        // {
        //     title: 'Mô Tả',
        //     dataIndex: 'Auction_description',
        //     key: 'Auction_description',
        // },
        // {
        //     title: 'Quy Tắc',
        //     dataIndex: 'Auction_Rules',
        //     key: 'Auction_Rules',
        // },
        // {
        //     title: 'Kế Hoạch',
        //     dataIndex: 'Auction_Planning_Map',
        //     key: 'Auction_Planning_Map',
        // },
        {
            title: 'Ngày ĐK Mở',
            dataIndex: 'Register_open_date',
            key: 'Register_open_date',
            render: (text: string) => new Date(text).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        },
        {
            title: 'Ngày ĐK Kết Thúc',
            dataIndex: 'Register_end_date',
            key: 'Register_end_date',
            render: (text: string) => new Date(text).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        },
        {
            title: 'Ngày Bắt Đầu',
            dataIndex: 'Auction_start_date',
            key: 'Auction_start_date',
            render: (text: string) => new Date(text).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        },
        {
            title: 'Ngày Kết Thúc',
            dataIndex: 'Auction_end_date',
            key: 'Auction_end_date',
            render: (text: string) => new Date(text).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        },
        // {
        //     title: 'Người Tạo',
        //     dataIndex: 'CreateBy',
        //     key: 'CreateBy',
        // },
        // {
        //     title: 'Thời Gian Tạo',
        //     dataIndex: 'CreateAt',
        //     key: 'CreateAt',
        //     render: (text: string) => new Date(text).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        // },
        // {
        //     title: 'Người Cập Nhật',
        //     dataIndex: 'UpdateBy',
        //     key: 'UpdateBy',
        // },
        // {
        //     title: 'Thời Gian Cập Nhật',
        //     dataIndex: 'UpdateAt',
        //     key: 'UpdateAt',
        //     render: (text: string) => new Date(text).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        // },
        // {
        //     title: 'Liên Kết',
        //     dataIndex: 'Or_link',
        //     key: 'Or_link',
        // },
        {
            title: 'Số Vòng Tối Đa',
            dataIndex: 'Number_round_max',
            key: 'Number_round_max',
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'Status',
            key: 'Status',
        },
        // {
        //     title: 'Dữ Liệu Người Thắng',
        //     dataIndex: 'Winner_data',
        //     key: 'Winner_data',
        //     render: (text: string) => JSON.stringify(text),
        // },
    ];
    const handleSearch = () => {
        form.validateFields().then((values) => {
            onSearch(values); // Truyền giá trị tìm kiếm lên component cha
        });
    };

    const onClickAddnew = () => {
        navigate(ROUTERCOMPANY.PATH + `/` + ROUTERCOMPANY.SUB.POST_AUCTION)
    }
    return (
        <div className="w-full h-full">
            <div className="w-full h-1/5 flex items-center justify-between">
                <Button
                    type="primary"
                    htmlType="button"
                    icon={<PlusOutlined />}
                    style={{ height: 40, padding: '0 20px' }}
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
                    <Form.Item label="Tên Đấu Giá 2" name='id'>
                        <Input
                            placeholder="Tìm kiếm theo auction name!"
                            style={{ width: 250, height: 40 }}
                            className="rounded-lg"
                        />
                    </Form.Item>
                    {/* <Form.Item label="Tên Đấu Giá 3">
                        <Input
                            placeholder="Tìm kiếm theo auction name!"
                            style={{ width: 250, height: 40 }}
                            className="rounded-lg"
                        />
                    </Form.Item> */}
                    <Form.Item label="  ">
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SearchOutlined />}
                            style={{ height: 40, padding: '0 20px' }}
                            className="rounded-lg flex items-center"
                        >
                            Tìm kiếm
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div>
                <Table<AuctionDataType>
                    columns={columns}
                    dataSource={AuctionData}
                />
            </div>
        </div>

    )
}

export default AcutionList