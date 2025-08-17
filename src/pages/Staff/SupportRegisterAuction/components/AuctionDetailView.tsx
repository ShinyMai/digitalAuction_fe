/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Table,
  Typography,
  Spin,
  Modal,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  DownloadOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import type { AuctionDataDetail, AuctionAsset } from "../../../Staff/Modals";
import { formatNumber } from "../../../../utils/numberFormat";
import { toast } from "react-toastify";
import AuctionServices from "../../../../services/AuctionServices";
import UserServices from "../../../../services/UserServices";
import { exportToDocx } from "../../../../components/Common/ExportDocs/DocumentGenerator";

const { Title, Text, Paragraph } = Typography;

interface RegistrationData {
  citizenIdentification?: string;
  bankAccount?: string;
  bankAccountNumber?: string;
  bankBranch?: string;
  selectedAssets?: AuctionAsset[];
  allSelectedAssets?: AuctionAsset[];
}

interface AuctionDetailViewProps {
  auctionDetail: AuctionDataDetail | null;
  loading: boolean;
  onBack: () => void;
  auctionId: string | null;
}

const AuctionDetailView = ({
  auctionDetail,
  loading,
  onBack,
  auctionId,
}: AuctionDetailViewProps) => {
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [isUserRegistered, setIsUserRegistered] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [registrationData, setRegistrationData] =
    useState<RegistrationData | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [hasDownloaded, setHasDownloaded] = useState<boolean>(false);

  const columns = [
    {
      title: "Tên tài sản",
      dataIndex: "tagName",
      key: "tagName",
    },
    {
      title: "Giá khởi điểm",
      dataIndex: "startingPrice",
      key: "startingPrice",
      render: (price: number, record: AuctionAsset) =>
        `${formatNumber(price)}/ ${record.unit}`,
    },
  ];

  const paginatedAssets =
    auctionDetail?.listAuctionAssets?.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    ) || [];

  const totalRegistrationFee = selectedRows?.reduce(
    (total, asset) => total + (asset.registrationFee || 0),
    0
  );

  const totalDeposit = selectedRows?.reduce(
    (total, asset) => total + (asset.deposit || 0),
    0
  );

  /** Handle registration submission */
  const handleSubmit = async () => {
    if (selectedRowKeys.length === 0) {
      toast.error("Vui lòng chọn ít nhất một tài sản đấu giá!");
      return;
    }

    const formData = form.getFieldsValue();
    const requestData = {
      ...formData,
      auctionId,
      auctionAssetsIds: selectedRowKeys,
    };

    try {
      const res = await AuctionServices.supportRegisterAuction(requestData);
      if (res.code === 200) {
        toast.success("Đăng ký thành công!");

        const selectedAssets =
          auctionDetail?.listAuctionAssets?.filter((asset) =>
            selectedRowKeys.includes(asset.auctionAssetsId)
          ) || [];

        setRegistrationData({
          ...formData,
          selectedAssets,
          allSelectedAssets: selectedAssets,
        });

        setShowSuccessModal(true);
        setHasDownloaded(false); // Reset download status
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Đăng ký thất bại! Vui lòng thử lại."
      );
    } finally {
      setSelectedRowKeys([]);
    }
  };

  /** Check if user is already registered */
  const checkUserRegistered = async (citizenIdentification: string) => {
    try {
      const res = await UserServices.getUserByCccd(citizenIdentification);
      if (res.code === 200) {
        setIsUserRegistered(true);
        setUserInfo(res.data);
        toast.success("Người dùng đã đăng ký!");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Kiểm tra thất bại! Vui lòng thử lại."
      );
    }
  };

  /** Export all registration documents */
  const handleExportDocuments = () => {
    if (!registrationData?.allSelectedAssets) return;

    registrationData.allSelectedAssets.forEach((asset, index) => {
      const documentData = {
        fullName: userInfo?.name || "",
        dob: userInfo?.birthDay || "",
        idNumber:
          userInfo?.citizenIdentification ||
          registrationData.citizenIdentification ||
          "",
        idDate: userInfo?.issueDate || "",
        place: userInfo?.issueBy || "",
        phone: userInfo?.phoneNumber || "",
        address: userInfo?.recentLocation || "",
        auctionInfo: asset.tagName || "",
        assetsInfo: asset.tagName || "",
        priceStart: asset.startingPrice?.toString() || "",
        bankAccount: registrationData.bankAccount || "",
        bankAccountNumber: registrationData.bankAccountNumber || "",
        bankBranch: registrationData.bankBranch || "",
        locationDate: new Date().toISOString(),
      };

      // Delay to avoid browser blocking
      setTimeout(() => {
        exportToDocx(documentData);
      }, index * 1000);
    });

    // Mark as downloaded after first document starts downloading
    setHasDownloaded(true);

    toast.success(
      `Đang tải xuống ${registrationData.allSelectedAssets.length} phiếu đăng ký...`
    );
  };

  /** Table Pagination */
  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <motion.div
      key="detail"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full overflow-hidden"
    >
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={onBack}
        className="!mb-4"
        size="large"
      >
        Quay lại
      </Button>

      {loading && <Spin size="large" className="!flex !justify-center !my-8" />}

      {auctionDetail && !loading && (
        <div className="flex flex-col xl:flex-row gap-4 w-full">
          {/* Auction Info Card */}
          <Card className="!shadow-md !rounded-lg !flex-1 !min-w-0">
            <div className="flex flex-col">
              <div className="mb-6">
                <Title level={4} className="!text-gray-800 !mb-4">
                  Thông Tin Buổi Đấu Giá
                </Title>
                <div className="space-y-2">
                  <div>
                    <Text strong>Tên buổi đấu giá: </Text>
                    <Text>{auctionDetail.auctionName}</Text>
                  </div>
                  <div>
                    <Text strong>Danh mục: </Text>
                    <Text>{auctionDetail.categoryName}</Text>
                  </div>
                  <div>
                    <Text strong>Mô tả: </Text>
                    <Text>{auctionDetail.auctionDescription || "-"}</Text>
                  </div>
                </div>
              </div>

              {auctionDetail.listAuctionAssets?.length ? (
                <div>
                  <Title level={4} className="text-gray-800 mb-4">
                    Danh Sách Tài Sản Đấu Giá
                  </Title>
                  <Table
                    rowSelection={{
                      type: "checkbox",
                      selectedRowKeys,
                      onChange: (keys, rows) => {
                        setSelectedRowKeys(keys as string[]);
                        setSelectedRows(rows);
                      },
                    }}
                    columns={columns}
                    dataSource={paginatedAssets}
                    rowKey="auctionAssetsId"
                    pagination={{
                      current: currentPage,
                      pageSize,
                      total: auctionDetail.listAuctionAssets.length,
                      showSizeChanger: true,
                      pageSizeOptions: ["5", "10", "20"],
                    }}
                    onChange={handleTableChange}
                    locale={{ emptyText: "Không có tài sản" }}
                    className="w-full rounded-lg overflow-hidden"
                    rowClassName="hover:bg-blue-50 transition-colors duration-200"
                    scroll={{ x: true }}
                  />
                </div>
              ) : (
                <Text>Không có tài sản đấu giá.</Text>
              )}
              <div className="mt-2 font-semibold text-gray-700 text-lg">
                Tổng phí đăng ký tham gia phải trả:{" "}
                <span className="text-red-400">{totalRegistrationFee} VNĐ</span>
              </div>
              <div className="mt-2 font-semibold text-gray-700 text-lg">
                Tổng tiền đặt cọc phải trả:{" "}
                <span className="text-red-400">{totalDeposit} VNĐ</span>
              </div>
            </div>
          </Card>

          {/* Registration Form Card */}
          <Card className="!shadow-md !rounded-lg !flex-1 !min-w-0">
            <Title level={4} className="!text-gray-800 !mb-4">
              Thông Tin Đăng Ký
            </Title>
            <Form form={form} layout="vertical" className="w-full">
              <Button
                onClick={() =>
                  checkUserRegistered(
                    form.getFieldValue("citizenIdentification")
                  )
                }
              >
                Kiểm tra
              </Button>

              <Form.Item
                name="citizenIdentification"
                label="Số căn cước"
                rules={[
                  { required: true, message: "Vui lòng nhập số căn cước!" },
                  {
                    validator: async () => {
                      if (isUserRegistered)
                        return Promise.reject("Người dùng đã đăng ký!");
                      return Promise.resolve();
                    },
                  },
                  {
                    pattern: /^[0-9]{12}$/,
                    message: "Số căn cước phải có 12 chữ số!",
                  },
                ]}
              >
                <Input placeholder="Nhập số căn cước" size="large" />
              </Form.Item>

              <Form.Item
                name="bankAccount"
                label="Tên người thụ hưởng"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                ]}
              >
                <Input placeholder="Nhập họ và tên" size="large" />
              </Form.Item>

              <Form.Item
                name="bankAccountNumber"
                label="Số tài khoản ngân hàng"
                rules={[
                  { required: true, message: "Vui lòng nhập số tài khoản!" },
                ]}
              >
                <Input placeholder="Nhập số tài khoản ngân hàng" size="large" />
              </Form.Item>

              <Form.Item
                name="bankBranch"
                label="Tên chi nhánh ngân hàng"
                rules={[
                  { required: true, message: "Vui lòng nhập tên ngân hàng!" },
                ]}
              >
                <Input placeholder="Nhập tên ngân hàng" size="large" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  size="large"
                  disabled={selectedRowKeys.length === 0 || !isUserRegistered}
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      )}

      {/* Success Modal */}
      <Modal
        open={showSuccessModal}
        onCancel={() => {
          if (!hasDownloaded) {
            toast.warning("Vui lòng tải xuống phiếu đăng ký trước khi đóng!");
            return;
          }
          setShowSuccessModal(false);
          onBack();
        }}
        closable={hasDownloaded}
        maskClosable={hasDownloaded}
        footer={null}
        width={600}
        centered
      >
        <div className="text-center py-6">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center shadow-lg text-green-500">
              <CheckCircleFilled className="text-5xl" />
            </div>
          </div>

          <Title level={4} className="!text-green-600 mb-4">
            🎉 Đăng ký thành công!
          </Title>

          <Paragraph className="text-gray-700 text-base mb-6">
            Đăng ký tham gia đấu giá tài sản thành công.
          </Paragraph>

          <Paragraph className="text-gray-700 text-base mb-6">
            Nhấn nút bên dưới để{" "}
            <span className="font-semibold text-blue-600">
              tải về {registrationData?.allSelectedAssets?.length || 0} phiếu
              đăng ký
            </span>{" "}
            tương ứng với các tài sản đã chọn.
          </Paragraph>

          {registrationData?.allSelectedAssets && (
            <div className="mb-4">
              <Text strong>Các tài sản đã chọn:</Text>
              <ul className="list-disc list-inside mt-2 ">
                {registrationData.allSelectedAssets.map((asset) => (
                  <li key={asset.auctionAssetsId} className="text-gray-600">
                    {asset.tagName} - {formatNumber(asset.startingPrice)}/
                    {asset.unit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-yellow-700">
              <div className="font-semibold">⚠️ Lưu ý quan trọng:</div>
              Vui lòng tải xuống phiếu đăng ký và nộp lại để hoàn tất đăng ký.
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              icon={<DownloadOutlined />}
              type="primary"
              size="large"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleExportDocuments}
            >
              Tải tất cả phiếu đăng ký (
              {registrationData?.allSelectedAssets?.length || 0} phiếu)
            </Button>

            {hasDownloaded && (
              <Button
                size="large"
                onClick={() => {
                  setShowSuccessModal(false);
                  onBack();
                }}
              >
                Đóng
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default AuctionDetailView;
