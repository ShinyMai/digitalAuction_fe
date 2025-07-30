/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"; // Thêm useEffect
import { Button, Card, Form, Input, Table, Typography, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import type { AuctionDataDetail, AuctionAsset } from "../../../Staff/Modals";
import { formatNumber } from "../../../../utils/numberFormat";
import { toast } from "react-toastify";
import AuctionServices from "../../../../services/AuctionServices";
import UserServices from "../../../../services/UserServices";

const { Title, Text } = Typography;

const AuctionDetailView = ({
  auctionDetail,
  loading,
  onBack,
  auctionId,
}: {
  auctionDetail: AuctionDataDetail | null;
  loading: boolean;
  onBack: () => void;
  auctionId: string | null;
}) => {
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [isUserRegistered, setIsUserRegistered] = useState<boolean>(false);

  console.log(auctionId);
  console.log("Selected Auction ID:", selectedRowKeys);

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
        onBack();
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

  const checkUserRegistered = async (citizenIdentification: string) => {
    try {
      const res = await UserServices.getUserByCccd(citizenIdentification);
      if (res.code === 200) {
        setIsUserRegistered(true);
        toast.success("Người dùng đã đăng ký!");
      } else {
        toast.error("Người dùng chưa đăng ký!");
        setIsUserRegistered(false);
      }
    } catch (error) {
      toast.error("Lỗi khi kiểm tra đăng ký người dùng!");
      console.error(error);
    }
  };

  const paginatedAssets = auctionDetail?.listAuctionAssets
    ? auctionDetail.listAuctionAssets.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      )
    : [];

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
              {auctionDetail.listAuctionAssets &&
                auctionDetail.listAuctionAssets.length > 0 && (
                  <div>
                    <Title level={4} className="text-gray-800 mb-4">
                      Danh Sách Tài Sản Đấu Giá
                    </Title>
                    <Table
                      rowSelection={{
                        type: "checkbox",
                        selectedRowKeys,
                        onChange: (selectedKeys) =>
                          setSelectedRowKeys(selectedKeys as string[]),
                      }}
                      columns={columns}
                      dataSource={paginatedAssets}
                      rowKey="auctionAssetsId"
                      pagination={{
                        current: currentPage,
                        pageSize: pageSize,
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
                )}
            </div>
          </Card>
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
                      if (isUserRegistered === true) {
                        return Promise.reject("Người dùng đã đăng ký!");
                      }
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
                  {
                    required: true,
                    message: "Vui lòng nhập số tài khoản ngân hàng!",
                  },
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
                  disabled={
                    selectedRowKeys.length === 0 || isUserRegistered === false
                  }
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      )}
    </motion.div>
  );
};

export default AuctionDetailView;
