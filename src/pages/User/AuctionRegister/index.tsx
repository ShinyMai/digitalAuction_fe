/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button, Steps } from "antd";
import AssetSelect from "./components/AssetSelect";
import type {
  AuctionAsset,
  AuctionDataDetail,
  dataPayment,
} from "../../Anonymous/Modals";
import { useLocation, useNavigate } from "react-router-dom";
import InfomationRegisterAsset from "./components/InfomationRegisterAssest";
import SepayAuctionregister from "./components/SepayAuctionRegister";
import { useSelector } from "react-redux";
import UserServices from "../../../services/UserServices";
import { ArrowLeftOutlined } from "@ant-design/icons";

const AuctionRegister = () => {
  const [current, setCurrent] = useState(0);
  const location = useLocation();
  const [auctionDetail] = useState<AuctionDataDetail>(
    location.state?.key
  );
  const [selectedAssets, setSelectedAssets] =
    useState<AuctionAsset>();
  const [dataPayment, setDatapayment] =
    useState<dataPayment>();
  const { user } = useSelector((state: any) => state.auth);
  const [userInfo, setUserInfo] = useState<any>();
  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const res = await UserServices.getUserInfo({
        user_id: user.id,
      });

      if (res.code === 200) {
        setUserInfo(res.data);
      }
    } catch (error) {
      console.error(
        "Lỗi khi lấy thông tin người dùng:",
        error
      );
    }
  };

  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onGetSelectAsset = (value: string) => {
    if (auctionDetail?.listAuctionAssets) {
      const dataAuctionAssetsSelected =
        auctionDetail.listAuctionAssets.find((item) =>
          value.includes(item.auctionAssetsId)
        );
      setSelectedAssets(dataAuctionAssetsSelected);
    }
  };

  const steps = [
    {
      title: "Chọn Tài Sản",
      content: (
        <AssetSelect
          listAsset={auctionDetail?.listAuctionAssets || []}
          onGetAssetSelect={onGetSelectAsset}
          onNext={() => setCurrent(current + 1)}
          onPrev={() =>
            current > 0 && setCurrent(current - 1)
          }
        />
      ),
    },
    {
      title: "Thông Tin Đăng Ký",
      content: (
        <InfomationRegisterAsset
          auctionAssetsSelected={selectedAssets}
          onNext={() => setCurrent(current + 1)}
          onPrev={() =>
            current > 0 && setCurrent(current - 1)
          }
          onSetDataPayment={setDatapayment}
          userInfo={userInfo}
        />
      ),
    },
    {
      title: "Thanh Toán",
      content: (
        <SepayAuctionregister
          dataAutionAsset={selectedAssets}
          dataQrSepay={dataPayment}
          dataUser={userInfo}
        />
      ),
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  // const contentStyle = {
  //     minHeight: "400px",
  //     textAlign: "center",
  //     color: token.colorTextTertiary,
  //     backgroundColor: token.colorFillAlter,
  //     borderRadius: token.borderRadiusLG,
  //     border: `1px dashed ${token.colorBorder}`,
  //     marginTop: 16,
  //     padding: "20px",
  // };

  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-teal-50 flex flex-col">
      <style>
        {`
          .pagination-custom .ant-steps-item-icon,
          .pagination-custom .ant-steps-item-title {
            color: #4b5563 !important; /* gray-600 */
          }
          .pagination-custom .ant-steps-item-active .ant-steps-item-icon,
          .pagination-custom .ant-steps-item-active .ant-steps-item-title {
            color: #2563eb !important; /* blue-600 */
          }
          .pagination-custom .ant-steps-item-process .ant-steps-item-icon {
            background: #2563eb !important;
            border-color: #2563eb !important;
          }
        `}
      </style>
      <div className=" top-0 bg-white shadow-lg py-4">
        <div>
          <Button
            type="text"
            icon={
              <ArrowLeftOutlined className="text-blue-800 text-lg" />
            }
            onClick={() => navigate("/auction-list")}
            className="p-0 hover:bg-blue-100"
          />
        </div>
        <div className="container mx-auto px-4">
          <div className="w-full mx-auto">
            <Steps
              current={current}
              items={items}
              className="pagination-custom"
              labelPlacement="vertical"
            />
          </div>
        </div>
      </div>
      <div className="flex-grow container mx-auto bg-white mt-6 rounded-lg">
        <div>{steps[current].content}</div>
      </div>
    </section>
  );
};

export default AuctionRegister;
