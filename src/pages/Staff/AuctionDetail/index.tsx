import { useLocation } from "react-router-dom";
import AuctionServices from "../../../services/AuctionServices";
import { useEffect, useState } from "react";
import type {
  AuctionDataDetail,
  AuctionDateModal,
} from "../Modals";
import { useAppRouting } from "../../../hooks/useAppRouting";
import AuctionDetail from "./components/AuctionDetail";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import ListAuctionDocument from "./components/ListAuctionDocument";

const AuctionDetailAnonymous = () => {
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
    <section className="p-6 bg-gradient-to-b from-blue-50 to-teal-50 min-h-screen">
      <div className="w-fit mx-auto rounded-lg">
        <Tabs
          defaultActiveKey="1"
          className="w-full"
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
          <TabPane tab="Danh sách đơn đăng ký" key="2">
            <ListAuctionDocument
              auctionId={location.state.key}
              auctionDateModals={auctionDateModal}
            />
          </TabPane>
        </Tabs>
      </div>
    </section>
  );
};

export default AuctionDetailAnonymous;
