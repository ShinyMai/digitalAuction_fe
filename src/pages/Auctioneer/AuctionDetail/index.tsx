import { useLocation } from "react-router-dom";
import AuctionServices from "../../../services/AuctionServices";
import { useEffect, useState } from "react";
import type {
  AuctionDataDetail,
  AuctionDateModal,
  AuctionRoundPrice,
} from "../Modals";
import { useAppRouting } from "../../../hooks/useAppRouting";
import AuctionDetail from "./components/AuctionDetail";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import ListAuctionDocument from "./components/ListAuctionDocument";
import InputAuctionPrice from "./components/InputAuctionPrice";
import AuctioneerCreateAuctionRound from "./components/AuctioneerCreateAuctionRound";

const auctionRoundPriceFakeData: AuctionRoundPrice[] = [
  {
    "AuctionRoundId": "AR001",
    "UserName": "Nguyễn Văn An",
    "CitizenIdentification": "123456789012",
    "RecentLocation": "Quận 1, TP.HCM",
    "TagName": "Nhà phố 3 tầng",
    "AuctionPrice": "5000000000"
  },
  {
    "AuctionRoundId": "AR002",
    "UserName": "Trần Thị Bình",
    "CitizenIdentification": "987654321098",
    "RecentLocation": "Cầu Giấy, Hà Nội",
    "TagName": "Ô tô Mercedes C200",
    "AuctionPrice": "1200000000"
  },
  {
    "AuctionRoundId": "AR003",
    "UserName": "Lê Hoàng Minh",
    "CitizenIdentification": "456789123456",
    "RecentLocation": "TP. Đà Nẵng",
    "TagName": "Đất nền 100m2",
    "AuctionPrice": "3000000000"
  },
  {
    "AuctionRoundId": "AR004",
    "UserName": "Phạm Thị Hồng",
    "CitizenIdentification": "321654987123",
    "RecentLocation": "Bình Thạnh, TP.HCM",
    "TagName": "Căn hộ chung cư 80m2",
    "AuctionPrice": "2500000000"
  },
  {
    "AuctionRoundId": "AR005",
    "UserName": "Hoàng Văn Nam",
    "CitizenIdentification": "789123456789",
    "RecentLocation": "Hai Bà Trưng, Hà Nội",
    "TagName": "Xe máy SH 150i",
    "AuctionPrice": "150000000"
  },
  {
    "AuctionRoundId": "AR005",
    "UserName": "Hoàng Văn Nam",
    "CitizenIdentification": "789123456789",
    "RecentLocation": "Hai Bà Trưng, Hà Nội",
    "TagName": "Xe máy SH 150i",
    "AuctionPrice": "150000000"
  },
  {
    "AuctionRoundId": "AR005",
    "UserName": "Hoàng Văn Nam",
    "CitizenIdentification": "789123456789",
    "RecentLocation": "Hai Bà Trưng, Hà Nội",
    "TagName": "Xe máy SH 150i",
    "AuctionPrice": "150000000"
  },
  {
    "AuctionRoundId": "AR005",
    "UserName": "Hoàng Văn Nam",
    "CitizenIdentification": "789123456789",
    "RecentLocation": "Hai Bà Trưng, Hà Nội",
    "TagName": "Xe máy SH 150i",
    "AuctionPrice": "150000000"
  },
  {
    "AuctionRoundId": "AR005",
    "UserName": "Hoàng Văn Nam",
    "CitizenIdentification": "789123456789",
    "RecentLocation": "Hai Bà Trưng, Hà Nội",
    "TagName": "Xe máy SH 150i",
    "AuctionPrice": "150000000"
  },
  {
    "AuctionRoundId": "AR005",
    "UserName": "Hoàng Văn Nam",
    "CitizenIdentification": "789123456789",
    "RecentLocation": "Hai Bà Trưng, Hà Nội",
    "TagName": "Xe máy SH 150i",
    "AuctionPrice": "150000000"
  },
  {
    "AuctionRoundId": "AR005",
    "UserName": "Hoàng Văn Nam",
    "CitizenIdentification": "789123456789",
    "RecentLocation": "Hai Bà Trưng, Hà Nội",
    "TagName": "Xe máy SH 150i",
    "AuctionPrice": "150000000"
  },
  {
    "AuctionRoundId": "AR005",
    "UserName": "Hoàng Văn Nam",
    "CitizenIdentification": "789123456789",
    "RecentLocation": "Hai Bà Trưng, Hà Nội",
    "TagName": "Xe máy SH 150i",
    "AuctionPrice": "150000000"
  },
  {
    "AuctionRoundId": "AR005",
    "UserName": "Hoàng Văn Nam",
    "CitizenIdentification": "789123456789",
    "RecentLocation": "Hai Bà Trưng, Hà Nội",
    "TagName": "Xe máy SH 150i",
    "AuctionPrice": "150000000"
  },
  {
    "AuctionRoundId": "AR005",
    "UserName": "Hoàng Văn Nam",
    "CitizenIdentification": "789123456789",
    "RecentLocation": "Hai Bà Trưng, Hà Nội",
    "TagName": "Xe máy SH 150i",
    "AuctionPrice": "150000000"
  },
  {
    "AuctionRoundId": "AR005",
    "UserName": "Hoàng Văn Nam",
    "CitizenIdentification": "789123456789",
    "RecentLocation": "Hai Bà Trưng, Hà Nội",
    "TagName": "Xe máy SH 150i",
    "AuctionPrice": "150000000"
  },
  {
    "AuctionRoundId": "AR005",
    "UserName": "Hoàng Văn Nam",
    "CitizenIdentification": "789123456789",
    "RecentLocation": "Hai Bà Trưng, Hà Nội",
    "TagName": "Xe máy SH 150i",
    "AuctionPrice": "150000000"
  },
  {
    "AuctionRoundId": "AR005",
    "UserName": "Hoàng Văn Nam",
    "CitizenIdentification": "789123456789",
    "RecentLocation": "Hai Bà Trưng, Hà Nội",
    "TagName": "Xe máy SH 150i",
    "AuctionPrice": "150000000"
  },
  {
    "AuctionRoundId": "AR005",
    "UserName": "Hoàng Văn Nam",
    "CitizenIdentification": "789123456789",
    "RecentLocation": "Hai Bà Trưng, Hà Nội",
    "TagName": "Xe máy SH 150i",
    "AuctionPrice": "150000000"
  }
]

const AuctionDetailAuctioneer = () => {
  const location = useLocation();
  const [auctionDetailData, setAuctionDetailData] =
    useState<AuctionDataDetail>();
  const { role } = useAppRouting();
  const [
    isOpentPopupVerifyCancel,
    setIsOpenPopupVerifyCancel,
  ] = useState<boolean>(false);
  const [auctionDateModal, setAuctionDateModal] =
    useState<AuctionDateModal>();
  const [listAuctionRoundPice] = useState<AuctionRoundPrice[]>(auctionRoundPriceFakeData)

  useEffect(() => {
    console.log("role: ", role);
    getAuctionDetailById(location.state.key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(isOpentPopupVerifyCancel);

  const getAuctionDetailById = async (
    auctionId: string
  ) => {
    try {
      const response =
        await AuctionServices.getAuctionDetail(auctionId);
      console.log(response.data);
      const auctionDate: AuctionDateModal = {
        auctionEndDate: response.data?.auctionEndDate,
        auctionStartDate: response.data?.auctionStartDate,
        registerOpenDate: response.data?.registerOpenDate,
        registerEndDate: response.data?.registerEndDate,
      };
      setAuctionDateModal(auctionDate);
      setAuctionDetailData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="p-6 h-full bg-gradient-to-b from-blue-50 to-teal-50">
      <div className="w-full mx-auto rounded-lg h-full">
        <Tabs
          defaultActiveKey="1"
          className="w-full h-full"
          tabBarStyle={{
            background: "#ffff",
            borderRadius: "8px",
            padding: "18px",
          }}
        >
          <TabPane tab="Thông tin đấu giá" key="1">
            <AuctionDetail
              auctionDetailData={auctionDetailData}
              setIsOpenPopupVerifyCancel={
                setIsOpenPopupVerifyCancel
              }
            />
          </TabPane>
          <TabPane tab="Danh sách tham gia đấu giá" key="2">
            <ListAuctionDocument
              auctionId={location.state.key}
              auctionDateModals={auctionDateModal}
            />
          </TabPane>
          {
            role == "Auctioneer" ?
              <TabPane tab="Tạo vòng đấu giá" key="3" className="w-full h-full">
                <AuctioneerCreateAuctionRound
                  auctionRoundPrices={listAuctionRoundPice}
                />
              </TabPane>
              :
              <TabPane tab="Nhập giá" key="3">
                <InputAuctionPrice auctionId={location.state.key}
                />
              </TabPane>
          }

        </Tabs>
      </div>
    </section>
  );
};

export default AuctionDetailAuctioneer;
