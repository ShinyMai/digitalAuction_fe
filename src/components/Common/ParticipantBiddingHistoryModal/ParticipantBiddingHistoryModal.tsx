import React, { useEffect } from "react";
import { Modal, Tabs, Button, Space, Spin } from "antd";
import {
  UserOutlined,
  HistoryOutlined,
  FileTextOutlined,
  TrophyOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import AuctionListTable from "./components/AuctionListTable";
import DocumentDetailTable from "./components/DocumentDetailTable";
import DetailStatistics from "./components/DetailStatistics";
import OverallStatistics from "./components/OverallStatistics";
import EmptyState from "./components/EmptyState";

import { useParticipantBiddingHistory } from "./hooks/useParticipantBiddingHistory";
import type { ParticipantBiddingHistoryModalProps } from "./types";

const modalStyles = `
.participant-bidding-history-modal .ant-modal-content {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.participant-bidding-history-modal .ant-modal-header {
  border-bottom: none;
  padding: 0;
}

.participant-bidding-history-modal .ant-modal-body {
  padding: 0;
}

.participant-bidding-history-modal .ant-modal-footer {
  border-top: none;
  padding: 0;
}

.participant-bidding-history-modal .ant-tabs .ant-tabs-tab {
  padding: 12px 16px;
  margin: 0 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.participant-bidding-history-modal .ant-tabs .ant-tabs-tab:hover {
  background: rgba(24, 144, 255, 0.1);
}

.participant-bidding-history-modal .ant-tabs .ant-tabs-tab-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
}

.participant-bidding-history-modal .ant-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
  color: white !important;
}

.participant-bidding-history-modal .ant-pagination {
  margin: 24px !important;
}

.participant-bidding-history-modal .ant-select-selector {
  border-radius: 6px !important;
  height: 32px !important;
  line-height: 30px !important;
}

.participant-bidding-history-modal .ant-pagination-options-quick-jumper input {
  border-radius: 6px !important;
  height: 32px !important;
}
`;

if (typeof document !== "undefined") {
  const existingStyle = document.getElementById("participant-modal-styles");
  if (!existingStyle) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "participant-modal-styles";
    styleSheet.innerText = modalStyles;
    document.head.appendChild(styleSheet);
  }
}

const ParticipantBiddingHistoryModal: React.FC<
  ParticipantBiddingHistoryModalProps
> = ({ visible, onClose, participantInfo }) => {
  const {
    loading,
    registeredAuctions,
    documents,
    statistics,
    viewMode,
    overallStatistics,

    fetchRegisteredAuctions,
    fetchParticipantData,
    calculateOverallStatistics,
    handleSelectAuction,
    handleBackToList,
  } = useParticipantBiddingHistory(participantInfo);

  useEffect(() => {
    if (visible && participantInfo) {
      if (viewMode === "list") {
        fetchRegisteredAuctions();
      } else if (viewMode === "detail") {
        fetchParticipantData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    visible,
    participantInfo?.citizenIdentification,
    viewMode,
    fetchRegisteredAuctions,
    fetchParticipantData,
  ]);

  useEffect(() => {
    if (registeredAuctions.length > 0 && participantInfo) {
      calculateOverallStatistics();
    }
  }, [registeredAuctions, participantInfo, calculateOverallStatistics]);

  const tabItems = [
    {
      key: "1",
      label: (
        <Space size="small">
          <HistoryOutlined
            style={{ color: viewMode === "list" ? "#1890ff" : "#722ed1" }}
          />
          <span style={{ fontWeight: 500 }}>
            {viewMode === "list"
              ? "Danh sách phiên đấu giá"
              : "Thông tin đăng ký"}
          </span>
        </Space>
      ),
      children: (
        <div className="min-h-96">
          {viewMode === "list" ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg">
              <AuctionListTable
                auctions={registeredAuctions}
                loading={loading}
                onSelectAuction={handleSelectAuction}
              />
            </div>
          ) : (
            <DocumentDetailTable
              documents={documents}
              loading={loading}
              onBackToList={handleBackToList}
            />
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <Space size="small">
          <FileTextOutlined style={{ color: "#52c41a" }} />
          <span style={{ fontWeight: 500 }}>Thống kê chi tiết</span>
        </Space>
      ),
      children: (
        <div className="min-h-96">
          {viewMode === "detail" ? (
            <DetailStatistics statistics={statistics} />
          ) : (
            <EmptyState
              title="Vui lòng chọn một phiên đấu giá để xem thống kê chi tiết"
              description="Thống kê sẽ hiển thị thông tin chi tiết về đăng ký và thanh toán"
              icon={
                <FileTextOutlined
                  style={{ color: "white", fontSize: "24px" }}
                />
              }
            />
          )}
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <Space size="small">
          <TrophyOutlined style={{ color: "#722ed1" }} />
          <span style={{ fontWeight: 500 }}>Thống kê tổng hợp</span>
        </Space>
      ),
      children: (
        <div className="min-h-96">
          <OverallStatistics
            statistics={overallStatistics}
            loading={loading}
            onRefresh={calculateOverallStatistics}
          />
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 -m-6 mb-0 border-b border-blue-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg">
              <UserOutlined className="text-white text-xl " />
            </div>
            <div className="flex-1">
              <div className="text-xl font-bold text-gray-800 mb-1 text-left">
                Lịch sử đấu giá của {participantInfo?.name}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  CMND/CCCD: {participantInfo?.citizenIdentification}
                </span>
              </div>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              style={{ borderRadius: "8px" }}
            />
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={1280}
      footer={
        <div className="flex justify-between items-center bg-gray-50 -m-6 mt-4 p-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Dữ liệu được cập nhật theo thời gian thực
          </div>
          <Button
            size="large"
            onClick={onClose}
            className="bg-gradient-to-r from-gray-500 to-gray-600 border-0 text-white hover:shadow-lg transition-all duration-200"
            style={{ borderRadius: "8px", minWidth: "100px" }}
          >
            Đóng
          </Button>
        </div>
      }
      className="participant-bidding-history-modal"
      style={{ top: 20 }}
      closeIcon={false}
      styles={{
        header: {
          padding: 0,
          borderBottom: "none",
        },
        body: {
          backgroundColor: "#fafafa",
          padding: "16px",
        },
        footer: {
          padding: 0,
          marginTop: 0,
        },
      }}
    >
      <Spin spinning={loading && registeredAuctions.length === 0}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Tabs
            defaultActiveKey="1"
            items={tabItems}
            className="custom-tabs"
            tabBarStyle={{
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
              margin: 0,
              padding: "8px 16px",
            }}
          />
        </div>
      </Spin>
    </Modal>
  );
};

export default ParticipantBiddingHistoryModal;
