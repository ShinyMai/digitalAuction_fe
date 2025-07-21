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
  Select,
} from "antd";

// Đã xóa import dayjs

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

  // Đã xóa kiểm tra thời gian đăng ký

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

  const handleInputChange = (
    key: keyof SearchParams,
    value: string
  ) => {
    const newValue = value || undefined;
    setSearchValues((prev) => ({
      ...prev,
      [key]: newValue,
    }));
    // Thực hiện search ngay khi giá trị thay đổi
    setSearchParams((prev) => ({
      ...prev,
      [key]: newValue,
      PageNumber: 1, // Reset về trang 1 khi tìm kiếm
    }));
  };
  // Đã xóa handleAction

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
      title: "Trạng thái cọc",
      dataIndex: "statusDeposit",
      key: "statusDeposit",
      render: (statusDeposit: number) => {
        const color = statusDeposit === 1 ? 'green' : 'orange';
        const text = statusDeposit === 1 ? 'Đã cọc' : 'Chưa cọc';
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <section className="w-full h-fit bg-gradient-to-b from-blue-50 to-teal-50">
      <div className="w-full mx-auto bg-white rounded-xl">
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-teal-500 to-blue-500">
              <h2 className="text-lg font-semibold text-white">Tìm kiếm hồ sơ đấu giá</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tên người đăng ký</label>
                  <Input
                    placeholder="Nhập tên người đăng ký..."
                    allowClear
                    value={searchValues.name}
                    onChange={(e) => handleInputChange("Name", e.target.value)}
                    className="w-full !rounded-md [&>input]:!py-2 [&>input]:!px-3 [&>input]:!border-gray-300 [&>input]:!hover:border-teal-500 [&>input]:!focus:border-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">CMND/CCCD</label>
                  <Input
                    placeholder="Nhập số CMND/CCCD..."
                    allowClear
                    value={searchValues.CitizenIdentification}
                    onChange={(e) => handleInputChange("CitizenIdentification", e.target.value)}
                    className="w-full !rounded-md [&>input]:!py-2 [&>input]:!px-3 [&>input]:!border-gray-300 [&>input]:!hover:border-teal-500 [&>input]:!focus:border-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tài sản đấu giá</label>
                  <Select
                    placeholder="Chọn tài sản đấu giá..."
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
                    className="w-full [&>.ant-select-selector]:!rounded-md [&>.ant-select-selector]:!h-[40px] [&>.ant-select-selector]:!py-1 [&>.ant-select-selector]:!px-3 [&>.ant-select-selector]:!border-gray-300 [&>.ant-select-selector]:!hover:border-teal-500 [&>.ant-select-selector]:!focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={auctionDocuments}
          rowKey="auctionDocumentsId"
          loading={loading}
          pagination={{
            current: searchParams.PageNumber,
            pageSize: 8, // Cố định 8 bản ghi/trang
            total: totalCount,
            showSizeChanger: false, // Ẩn tùy chọn thay đổi số lượng bản ghi/trang
            onChange: (page) =>
              setSearchParams((prev) => ({
                ...prev,
                PageNumber: page,
                PageSize: 8,
              })),
          }}
          scroll={{ x: "max-content" }}
          className="border border-teal-100 rounded-lg"
        />
      </div>
      {/* Đã xóa style cho gear icon */}
    </section>
  );
};

export default ListAuctionDocument;