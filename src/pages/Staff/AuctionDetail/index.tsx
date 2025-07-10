import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Tabs } from "antd";
import AuctionServices from "../../../services/AuctionServices";
import AuctionDetail from "./components/AuctionDetail";
import ListAuctionDocument from "./components/ListAuctionDocument";
import ListAuctionDocumentSuccessRegister from "./components/ListAuctionDocumentSuccessRegister";
import type { AuctionDataDetail, AuctionDateModal } from "../Modals";

const { TabPane } = Tabs;

const AuctionDetailAnonymous = () => {
  const { state } = useLocation();
  const auctionId = state?.key;
  const auctionType = state?.type;

  const [auctionDetailData, setAuctionDetailData] = useState<AuctionDataDetail>();
  const [auctionDateModal, setAuctionDateModal] = useState<AuctionDateModal>();
  const [isOpenPopupVerifyCancel, setIsOpenPopupVerifyCancel] = useState(false);

  console.log(isOpenPopupVerifyCancel);

  useEffect(() => {
    if (auctionId) {
      fetchAuctionDetail(auctionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionId]);

  const fetchAuctionDetail = async (id: string) => {
    try {
      const { data } =
        auctionType === "NODE"
          ? await AuctionServices.getAuctionDetailNode(id)
          : await AuctionServices.getAuctionDetail(id);
      const dateModal: AuctionDateModal = {
        auctionStartDate: data?.auctionStartDate,
        auctionEndDate: data?.auctionEndDate,
        registerOpenDate: data?.registerOpenDate,
        registerEndDate: data?.registerEndDate,
      };
      setAuctionDateModal(dateModal);
      setAuctionDetailData(data);
    } catch (error) {
      console.error("Error fetching auction detail:", error);
    }
  };
  console.log("auctionDetailData", auctionDetailData);
  return (
    <section className="p-6 bg-gradient-to-b from-blue-50 to-teal-50 min-h-screen">
      <div className="w-full mx-auto rounded-lg">
        <Tabs
          defaultActiveKey="1"
          className="w-full"
          tabBarStyle={{
            background: "#ffffff",
            borderRadius: "8px",
            padding: "18px",
          }}
        >
          <TabPane tab="Thông tin đấu giá" key="1">
            <AuctionDetail
              auctionDetailData={auctionDetailData}
              setIsOpenPopupVerifyCancel={setIsOpenPopupVerifyCancel}
              auctionType={auctionType}
            />
          </TabPane>
          <TabPane tab="Danh sách đơn đăng ký" key="2">
            <ListAuctionDocument auctionId={auctionId} auctionDateModals={auctionDateModal} />
          </TabPane>
          <TabPane tab="Danh sách đơn đã cọc" key="3">
            <ListAuctionDocumentSuccessRegister
              auctionId={auctionId}
              auctionDateModals={auctionDateModal}
            />
          </TabPane>
        </Tabs>
      </div>
    </section>
  );
};

export default AuctionDetailAnonymous;
