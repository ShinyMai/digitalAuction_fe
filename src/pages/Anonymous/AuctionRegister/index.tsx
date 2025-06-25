import React, { useEffect, useState } from "react";
import { Button, message, Steps, theme } from "antd";
import AssetSelect from "./components/AssetSelect";
import type { AuctionAsset, AuctionDataDetail } from "../Modals";
import { useLocation } from "react-router-dom";
import SepayComponent from "../../../components/Sepay";
import AuctionServices from "../../../services/AuctionServices";
import InfomationRegisterAsset from "./components/InfomationRegisterAssest";

const AuctionRegister = () => {
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const location = useLocation();
    const [auctionDetail, setAuctionDetail] = useState<AuctionDataDetail>(location.state?.key);
    const [selectedAssets, setSelectedAssets] = useState<AuctionAsset[]>([]);

    const onGetListSelectAsset = (value: string[]) => {
        if (auctionDetail?.listAuctionAssets) {
            const dataAuctionAssetsSelected = auctionDetail.listAuctionAssets.filter((item) =>
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
                    onValueAssetSelect={onGetListSelectAsset}
                    onNext={() => setCurrent(current + 1)}
                    onPrev={() => current > 0 && setCurrent(current - 1)}
                />
            ),
        },
        {
            title: "Thông Tin Đăng Ký",
            content: (
                <InfomationRegisterAsset
                    listAuctionAssetsSelected={selectedAssets}
                    onNext={() => setCurrent(current + 1)}
                    onPrev={() => current > 0 && setCurrent(current - 1)}
                />
            ),
        },
        {
            title: "Thanh Toán",
            content: <SepayComponent />,
        },
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const contentStyle = {
        minHeight: "400px",
        textAlign: "center",
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
        padding: "20px",
    };

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
            <div className="sticky top-0 z-10 bg-white shadow-lg py-4">
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
            <div className="flex-grow container mx-auto bg-white mt-6 rounded-lg ">
                <div>{steps[current].content}</div>
            </div>
        </section>
    );
};

export default AuctionRegister;