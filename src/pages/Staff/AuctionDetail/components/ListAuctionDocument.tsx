/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AuctionServices from "../../../../services/AuctionServices";
import type { AuctionDocument, AuctionDateModal } from "../../Modals";
import { Table, Input, Tag, Button, Dropdown, Menu } from "antd";
import { SearchOutlined, SettingOutlined } from "@ant-design/icons";
import DepositConfirmationPopup from "./DepositConfirmationPopup";

interface SearchParams {
  Name?: string;
  PageNumber?: number;
  PageSize?: number;
  CitizenIdentification?: string;
  TagName?: string;
  SortBy?: string;
  IsAscending?: boolean;
  StatusTicket?: number;
  StatusDeposit?: number;
}

interface Props {
  auctionId?: string;
  auctionDateModals?: AuctionDateModal;
}

const ListAuctionDocument = ({ auctionId }: Props) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    PageNumber: 1,
    PageSize: 8,
    StatusDeposit: 0,
    SortBy: "numericalorder",
    IsAscending: true,
  });
  const [auctionDocuments, setAuctionDocuments] = useState<AuctionDocument[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<AuctionDocument | null>(null);

  const getListAuctionDocument = useCallback(async () => {
    try {
      setLoading(true);
      const params: SearchParams = {
        PageNumber: searchParams.PageNumber || 1,
        PageSize: searchParams.PageSize || 8,
        SortBy: searchParams.SortBy,
        Name: searchParams.Name,
        CitizenIdentification: searchParams.CitizenIdentification,
        TagName: searchParams.TagName,
        IsAscending: searchParams.IsAscending,
        StatusDeposit: searchParams.StatusDeposit,
      };
      const response = await AuctionServices.getListAuctionDocument(params, auctionId);
      setAuctionDocuments(response.data.auctionDocuments);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách tài liệu đấu giá!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [searchParams, auctionId]);

  useEffect(() => {
    getListAuctionDocument();
  }, [getListAuctionDocument]);

  // Debounce effect cho search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Trigger search sau 500ms delay
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchParams.Name, searchParams.CitizenIdentification, searchParams.TagName]);

  const handleInputChange = (key: keyof SearchParams, value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      [key]: value || undefined,
      PageNumber: 1, // Reset về trang 1 khi search
    }));
  };

  const handleAction = async (action: string, record: AuctionDocument) => {
    try {
      if (action === "receiveTicket") {
        await AuctionServices.receiveAuctionRegistrationDocument({
          auctionDocumentsId: record.auctionDocumentsId,
        });
        toast.success("Đã xác nhận nhận phiếu!");
        getListAuctionDocument();
      } else if (action === "receiveDeposit") {
        setSelectedRecord(record);
        setIsPopupVisible(true);
      }
    } catch (error) {
      toast.error(`Lỗi khi thực hiện ${action === "receiveTicket" ? "nhận phiếu" : "nhận cọc"}!`);
      console.error(error);
    }
  };

  const handleConfirmDeposit = async (note: string) => {
    if (!selectedRecord) return;
    try {
      await AuctionServices.acceptPaymentDeposit(auctionId, selectedRecord.auctionDocumentsId, { note: note });
      toast.success("Đã xác nhận nhận cọc!");
      setIsPopupVisible(false);
      setSelectedRecord(null);
      getListAuctionDocument();
    } catch (error) {
      toast.error("Lỗi khi xác nhận nhận cọc!");
      console.error(error);
    }
  };

  const handleCancelPopup = () => {
    setIsPopupVisible(false);
    setSelectedRecord(null);
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "CMND/CCCD",
      dataIndex: "citizenIdentification",
      key: "citizenIdentification",
    },
    {
      title: "Tên tài sản",
      dataIndex: "tagName",
      key: "tagName",
    },
    {
      title: "Phí đăng ký",
      dataIndex: "registrationFee",
      key: "registrationFee",
      render: (registrationFee: number) => `${registrationFee.toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Nhận đơn",
      dataIndex: "statusTicket",
      key: "statusTicket",
      render: (statusTicket: number) => {
        const statusMap: { [key: number]: { color: string; text: string } } = {
          0: { color: "gray", text: "Chưa chuyển tiền" },
          1: { color: "blue", text: "Đã chuyển tiền" },
          2: { color: "cyan", text: "Đã nhận phiếu" },
          3: { color: "green", text: "Đã hoàn tiền" },
        };
        const { color, text } = statusMap[statusTicket] || { color: "gray", text: "Chưa chuyển tiền" };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Chức năng",
      key: "action",
      render: (_: any, record: AuctionDocument) => (
        <div className="w-full h-full flex justify-center">
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="receiveTicket"
                  onClick={() => handleAction("receiveTicket", record)}
                  disabled={record.statusTicket !== 1}
                >
                  Đã nhận phiếu
                </Menu.Item>
                <Menu.Item
                  key="receiveDeposit"
                  onClick={() => handleAction("receiveDeposit", record)}
                  disabled={record.statusTicket !== 2 || record.statusDeposit !== 0}
                >
                  Đã nhận cọc
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button
              type="text"
              icon={<SettingOutlined className="gear-icon" />}
              className="text-blue-600 hover:text-blue-800 text-lg"
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-teal-50">
      <div className="w-full mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">Tìm kiếm</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Input
              placeholder="Tìm kiếm theo tên"
              prefix={<SearchOutlined />}
              allowClear
              value={searchParams.Name}
              onChange={(e) => handleInputChange("Name", e.target.value)}
              className="w-full sm:w-1/3"
            />
            <Input
              placeholder="Tìm kiếm theo CMND/CCCD"
              prefix={<SearchOutlined />}
              allowClear
              value={searchParams.CitizenIdentification}
              onChange={(e) => handleInputChange("CitizenIdentification", e.target.value)}
              className="w-full sm:w-1/3"
            />
            <Input
              placeholder="Tìm kiếm theo tên tài sản"
              prefix={<SearchOutlined />}
              allowClear
              value={searchParams.TagName}
              onChange={(e) => handleInputChange("TagName", e.target.value)}
              className="w-full sm:w-1/3"
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={auctionDocuments}
          rowKey="auctionDocumentsId"
          loading={loading}
          pagination={{
            current: searchParams.PageNumber,
            pageSize: searchParams.PageSize,
            total: totalCount,
            showSizeChanger: true,
            pageSizeOptions: ["8", "16", "24", "32"],
            onChange: (page, pageSize) =>
              setSearchParams((prev) => ({
                ...prev,
                PageNumber: page,
                PageSize: pageSize,
              })),
          }}
          scroll={{ x: "max-content" }}
          className="border border-teal-100 rounded-lg"
        />
        {selectedRecord && (
          <DepositConfirmationPopup
            visible={isPopupVisible}
            onConfirm={handleConfirmDeposit}
            onCancel={handleCancelPopup}
            record={selectedRecord}
          />
        )}
      </div>
      <style>{`
        .gear-icon {
          font-size: 1.5rem;
          transition: transform 0.3s ease, color 0.3s ease;
        }
        .ant-btn:hover .gear-icon {
          transform: rotate(90deg);
          color: #1d4ed8;
        }
      `}</style>
    </section>
  );
};

export default ListAuctionDocument;