import { Card, Space, Typography } from "antd";
import { DollarOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ts2 from "../../../../assets/icon/tsvphc.svg";
import dayjs from "dayjs";
import type { AuctionDataList } from "../../Modals";
import { STAFF_ROUTES } from "../../../../routers";

interface Props {
    dataCard: AuctionDataList;
}

const AuctionCard = ({ dataCard }: Props) => {
    const navigate = useNavigate();
    const { Text } = Typography;

    return (
        <Card
            hoverable
            cover={
                <img
                    alt={dataCard.auctionName}
                    src='https://thamdinhgiathanhdo.com/wp-content/uploads/2020/10/quyen-su-dung-dat-la-gi.jpg'
                    className="w-full h-48 object-cover rounded-t-lg"
                />
            }
            className="shadow-lg mb-4"
            onClick={() => navigate(STAFF_ROUTES.SUB.AUCTION_DETAIL, { state: { key: dataCard.auctionId }, replace: true })}
        >
            <Card.Meta
                title={
                    <div className="text-center text-lg font-semibold">
                        {dataCard.auctionName}
                    </div>
                }
                description={
                    <Space direction="vertical" className="w-full">
                        <div className="flex items-center text-gray-800">
                            <FieldTimeOutlined className="mr-2" />
                            Ngày đấu giá:{" "}
                            <Text strong className="ml-2 text-lg">
                                {dayjs(dataCard.auctionStartDate).format("DD/MM/YYYY")}
                            </Text>
                        </div>
                        <div className="flex items-center text-gray-800">
                            <FieldTimeOutlined className="mr-2" />
                            Ngày kết thúc đăng ký:{" "}
                            <Text strong className="ml-2 text-lg">
                                {dayjs(dataCard.registerEndDate).format("DD/MM/YYYY")}
                            </Text>
                        </div>
                        {/* Uncomment if startingPrice is available in AuctionDataList */}
                        {/* <div className="flex items-center text-gray-800">
              <DollarOutlined className="mr-2" />
              Giá khởi điểm:{" "}
              <Text strong className="ml-2 text-lg text-green-500">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(dataCard.startingPrice)}
              </Text>
            </div> */}
                    </Space>
                }
            />
        </Card>
    );
};

export default AuctionCard;