import { Card, Table } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import type { AuctionRound } from "../modalsData";
import { getAuctionRoundsColumns } from "./tableColumns";

interface AuctionRoundsTableProps {
    auctionRounds: AuctionRound[];
    loading: boolean;
    onViewDetails?: (record: AuctionRound) => void;
}

const AuctionRoundsTable = ({ auctionRounds, loading, onViewDetails }: AuctionRoundsTableProps) => {
    const columns = getAuctionRoundsColumns({ onViewDetails });

    return (
        <Card
            title={
                <div className="!flex !items-center !gap-2">
                    <FileTextOutlined className="!text-blue-500" />
                    <span className="!text-gray-800 !font-semibold">Danh sách vòng đấu giá</span>
                </div>
            }
            className="!shadow-sm"
        >
            <Table
                columns={columns}
                dataSource={auctionRounds}
                rowKey="auctionRoundId"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} vòng đấu giá`,
                }}
                className="!overflow-x-auto"
                scroll={{ x: 1200 }}
            />
        </Card>
    );
};

export default AuctionRoundsTable;
