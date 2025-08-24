import { Card, Table } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import type { AuctionRound } from "../modalsData";
import { getAuctionRoundsColumns } from "./tableColumns";
import type { AuctionDataDetail } from "../../Modals";

interface AuctionRoundsTableProps {
  auctionRounds: AuctionRound[];
  loading: boolean;
  auction?: AuctionDataDetail;
  userRole?: string;
  onViewDetails?: (record: AuctionRound) => void;
  onInputPrice?: (record: AuctionRound) => void;
}

const AuctionRoundsTable = ({
  auctionRounds,
  loading,
  auction,
  userRole,
  onViewDetails,
  onInputPrice,
}: AuctionRoundsTableProps) => {
  const columns = getAuctionRoundsColumns({
    onViewDetails,
    onInputPrice,
    auction,
    userRole,
  });

  return (
    <Card
      title={
        <div className="!flex !items-center !gap-2">
          <FileTextOutlined className="!text-blue-500" />
          <span className="!text-gray-800 !font-semibold">
            Danh sách vòng đấu giá
          </span>
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
        scroll={{ x: 1200 }}
      />
    </Card>
  );
};

export default AuctionRoundsTable;
