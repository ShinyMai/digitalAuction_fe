/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AuctionServices from "../../../../services/AuctionServices";
import type {
  AuctionDocument,
  AuctionDateModal,
} from "../../Modals";
import {
  Table,
  Input,
  Tag,
  Button,
  Dropdown,
  Menu,
  Select,
} from "antd";
import {
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

interface AuctionAsset {
  auctionAssetsId: string;
  tagName: string;
}

interface Props {
  auctionId: string;
  auctionDateModals?: AuctionDateModal;
  auctionAssets: AuctionAsset[];
}

interface SearchParams {
  Name?: string;
  PageNumber?: number;
  PageSize?: number;
  CitizenIdentification?: string;
  TagName?: string;
  SortBy?: string;
  IsAscending?: boolean;
  statusTicket?: number
}

interface Props {
  auctionId: string;
  auctionDateModals?: AuctionDateModal;
}

const ListAuctionDocument = ({
  auctionId,
  auctionDateModals,
  auctionAssets,
}: Props) => {
  const [searchParams, setSearchParams] =
    useState<SearchParams>({
      PageNumber: 1,
      PageSize: 8,

      SortBy: 'numericalorder',
      IsAscending: true,
    });
  const [auctionDocuments, setAuctionDocuments] = useState<
    AuctionDocument[]
  >([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<{
    name?: string;
    CitizenIdentification?: string;
    TagName?: string;
  }>({});

  // Kiểm tra nếu ngày hiện tại nằm trong khoảng registerOpenDate đến registerEndDate
  const isWithinRegistrationPeriod =
    auctionDateModals?.registerOpenDate &&
      auctionDateModals?.registerEndDate
      ? dayjs().isAfter(
        dayjs(auctionDateModals.registerOpenDate)
      ) &&
      dayjs().isBefore(
        dayjs(auctionDateModals.registerEndDate)
      )
      : false;

  useEffect(() => {
    getListAuctionDocument();
  }, [searchParams, auctionId]);

  const getListAuctionDocument = async () => {
    try {
      setLoading(true);
      const params: SearchParams = {
        PageNumber: searchParams.PageNumber || 1,
        PageSize: searchParams.PageSize || 8,
        Name: searchParams.Name,
        CitizenIdentification:
          searchParams.CitizenIdentification,
        TagName: searchParams.TagName,
        SortBy: searchParams.SortBy,
        IsAscending: searchParams.IsAscending,
        statusTicket: searchParams.statusTicket
      };
      const response =
        await AuctionServices.getListAuctionDocument(
          params,
          auctionId
        );
      setAuctionDocuments(response.data.auctionDocuments);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      toast.error(
        "Lỗi khi tải danh sách tài liệu đấu giá!"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchParams((prev) => ({
      ...prev,
      ...searchValues,
      PageNumber: 1, // Reset về trang 1 khi tìm kiếm
    }));
  };

  const handleInputChange = (
    key: keyof SearchParams,
    value: string
  ) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };
  const handleAction = async (
    action: string,
    _record: AuctionDocument // eslint-disable-line @typescript-eslint/no-unused-vars
  ) => {
    try {
      // TODO: Uncomment when updateAuctionDocumentStatus is implemented in AuctionServices
      // if (action === "receiveTicket") {
      //   await AuctionServices.updateAuctionDocumentStatus(record.auctionDocumentsId, {
      //     statusTicket: 1,
      //   });
      //   toast.success("Đã xác nhận nhận phiếu!");
      // } else if (action === "receiveDeposit") {
      //   await AuctionServices.updateAuctionDocumentStatus(record.auctionDocumentsId, {
      //     statusDeposit: true,
      //   });
      //   toast.success("Đã xác nhận nhận cọc!");
      // }
      getListAuctionDocument();
    } catch (error) {
      toast.error(
        `Lỗi khi thực hiện ${action === "receiveTicket"
          ? "nhận phiếu"
          : "nhận cọc"
        }!`
      );
      console.error(error);
    }
  };

  const columns = [
    {
      title: "Số báo danh",
      dataIndex: "numericalOrder",
      key: "numericalOrder",
      render: (numericalOrder: number | null) =>
        numericalOrder || "-",
    },
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
      render: (registrationFee: number) =>
        `${registrationFee.toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Nhận đơn",
      dataIndex: "statusTicket",
      key: "statusTicket",
      render: (statusTicket: number) => {
        const statusMap: {
          [key: number]: { color: string; text: string };
        } = {
          0: { color: "gray", text: "Chưa xác nhận" },
          1: { color: "blue", text: "Đã xác nhận" },
        };
        const { color, text } = statusMap[statusTicket] || {
          color: "gray",
          text: "Chưa nhận đơn",
        };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Chức năng",
      key: "action",
      render: (_: any, record: AuctionDocument) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="receiveTicket"
                onClick={() =>
                  handleAction("receiveTicket", record)
                }
                disabled={
                  record.statusTicket === 1 ||
                  !isWithinRegistrationPeriod
                }
              >
                Đã nhận phiếu
              </Menu.Item>
              <Menu.Item
                key="receiveDeposit"
                onClick={() =>
                  handleAction("receiveDeposit", record)
                }
                disabled={
                  record.statusDeposit ||
                  !isWithinRegistrationPeriod
                }
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
      ),
    },
  ];

  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-teal-50">
      <div className="w-full mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Input
              placeholder="Tìm kiếm theo tên"
              prefix={<SearchOutlined />}
              allowClear
              value={searchValues.name}
              onChange={(e) =>
                handleInputChange("Name", e.target.value)
              }
              className="w-full sm:w-1/4"
            />
            <Input
              placeholder="Tìm kiếm theo CMND/CCCD"
              prefix={<SearchOutlined />}
              allowClear
              value={searchValues.CitizenIdentification}
              onChange={(e) =>
                handleInputChange(
                  "CitizenIdentification",
                  e.target.value
                )
              }
              className="w-full sm:w-1/4"
            />
            <Select
              placeholder="Chọn tài sản đấu giá"
              allowClear
              showSearch
              value={searchValues.TagName}
              onChange={(value) => handleInputChange("TagName", value)}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={auctionAssets.map(asset => ({
                value: asset.tagName,
                label: asset.tagName,
              }))}
              className="w-full sm:w-1/4"
            />
            <Button
              type="primary"
              onClick={handleSearch}
              className="bg-teal-500 hover:bg-teal-600 w-full sm:w-auto"
            >
              Tìm kiếm
            </Button>
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
      </div>
      <style>{`
        .gear-icon {
          font-size: 1.5rem; /* Tăng kích thước icon */
          transition: transform 0.3s ease, color 0.3s ease; /* Hiệu ứng mượt mà */
        }
        .ant-btn:hover .gear-icon {
          transform: rotate(90deg); /* Xoay 90 độ khi hover */
          color: #1d4ed8; /* Đổi màu thành xanh đậm khi hover */
        }
      `}</style>
    </section>
  );
};

export default ListAuctionDocument;