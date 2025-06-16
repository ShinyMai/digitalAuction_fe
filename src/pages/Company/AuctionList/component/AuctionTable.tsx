import { Table, type TableProps } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { ROUTERCOMPANY } from "../../../../routers";
import type { AuctionDataList } from "../../Modals";

interface Props {
    auctionData?: AuctionDataList[];
    headerTable: React.JSX.Element;
    onChange: (pagination: any, sorter: any) => void;
    total: number;
    loading: boolean;
    pageSize?: number;
    currentPage?: number;
}

const AuctionTable = ({ auctionData, headerTable, onChange, total, loading, pageSize, currentPage }: Props) => {
    const navigate = useNavigate()
    const columns: TableProps<AuctionDataList>["columns"] = [
        {
            title: "Số thứ tự",
            key: "index",
            render: (_: any, __: any, index: number) => ((currentPage || 1) - 1) * (pageSize || 10) + index + 1,
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
            render: (text: string) => (text ? dayjs(text).format("DD/MM/YYYY") : "-"),
        },
        {
            title: "Ngày ĐK Kết Thúc",
            dataIndex: "registerEndDate",
            key: "registerEndDate",
            sorter: true,
            render: (text: string) => (text ? dayjs(text).format("DD/MM/YYYY") : "-"),
        },
        {
            title: "Ngày Bắt Đầu",
            dataIndex: "auctionStartDate",
            key: "auctionStartDate",
            sorter: true,
            render: (text: string) => (text ? dayjs(text).format("DD/MM/YYYY") : "-"),
        },
        {
            title: "Ngày Kết Thúc",
            dataIndex: "auctionEndDate",
            key: "auctionEndDate",
            sorter: true,
            render: (text: string) => (text ? dayjs(text).format("DD/MM/YYYY") : "-"),
        },
        {
            title: "Người tạo",
            dataIndex: "createdByUserName",
            key: "createdByUserName",
            sorter: true,
            render: (text: string) => text || "-",
        },
    ];

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="w-full">{headerTable}</div>
            <Table<AuctionDataList>
                columns={columns}
                dataSource={auctionData}
                onChange={onChange}
                pagination={{
                    total,
                    pageSize,
                    current: currentPage,
                }}
                loading={loading}
                locale={{ emptyText: "Không có dữ liệu" }}
                className="w-full"
                onRow={(record) => ({
                    onClick: () => {
                        navigate(ROUTERCOMPANY.SUB.AUCTION_DETAIL, { state: { key: record.auctionId }, replace: true })
                    }
                })}
                rowClassName="cursor-pointer"
            />
        </div>
    );
};

export default AuctionTable;