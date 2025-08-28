import {
  Button,
  Image,
  Typography,
  Card,
  Modal,
  Form,
  InputNumber,
} from "antd";
import MINPHAPLOGO from "../../../../assets/logoNo.png";
import dayjs from "dayjs";
import type { AuctionDataDetail } from "../../Modals";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useState } from "react";
import { toast } from "react-toastify";

interface AuctionDetailProps {
  auctionDetailData: AuctionDataDetail | undefined;
  auctionType?: string;
  isHaveAuctionRound?: boolean;
  onCreateAuctionRound?: (valuePrice: CreateRoundFormData) => void;
  auctionId?: string;
}

interface CreateRoundFormData {
  priceMin: number;
  priceMax: number;
  totalPriceMax: number;
}

const USER_ROLES = {
  USER: "Customer",
  ADMIN: "Admin",
  STAFF: "Staff",
  AUCTIONEER: "Auctioneer",
  MANAGER: "Manager",
  DIRECTOR: "Director",
} as const;

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

const API_BASE_URL_NODE = import.meta.env.VITE_BE_URL_NODE;

const AuctionDetail = ({
  auctionDetailData,
  auctionType,
  onCreateAuctionRound,
  isHaveAuctionRound,
}: AuctionDetailProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.roleName as UserRole | undefined;

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm<CreateRoundFormData>();

  // Handle modal functions
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values: CreateRoundFormData) => {
    setIsSubmitting(true);
    try {
      const submitData = {
        priceMin: values.priceMin,
        priceMax: values.priceMax,
        totalPriceMax: values.totalPriceMax,
      };

      toast.success("Tạo vòng đấu giá thành công!");
      handleCloseModal();

      // Gọi callback để refresh data
      if (onCreateAuctionRound) {
        onCreateAuctionRound(submitData);
      }
    } catch (error) {
      console.error("Error creating auction round:", error);
      toast.error("Có lỗi xảy ra khi tạo vòng đấu giá!");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section className="bg-gradient-to-b from-blue-50 to-teal-50 overflow-auto">
      <div className="w-full mx-auto bg-white shadow-lg rounded-xl p-6">
        {auctionDetailData ? (
          <div className="space-y-8">
            {/* Thông tin đấu giá */}
            <div className="flex flex-col md:flex-row items-stretch mb-6">
              <div className="w-full md:w-1/3 mb-4 md:mb-0 flex-shrink-0">
                <div className="w-full h-full flex items-center justify-center">
                  <Image
                    src={MINPHAPLOGO}
                    alt="Logo Minh Pháp"
                    className="w-full max-w-[200px] md:max-w-[250px] object-contain"
                    preview={false}
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3 pl-0 md:pl-4">
                <h1 className="text-xl md:text-2xl font-bold text-blue-800 mb-2">
                  XEM CHI TIẾT THÔNG BÁO ĐẤU GIÁ TÀI SẢN
                </h1>
                <p className="text-teal-700 mb-4">
                  {auctionDetailData.auctionName ||
                    "Ngân hàng TMCP Quốc tế Việt Nam"}
                </p>
                <div className="space-y-2 bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-900">
                      Ngày mở đăng ký:
                    </span>
                    <span className="text-teal-800">
                      {auctionDetailData.registerOpenDate
                        ? dayjs(auctionDetailData.registerOpenDate).format(
                            "DD/MM/YYYY"
                          )
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-900">
                      Hạn đăng ký:
                    </span>
                    <span className="text-teal-800">
                      {auctionDetailData.registerEndDate
                        ? dayjs(auctionDetailData.registerEndDate).format(
                            "DD/MM/YYYY"
                          )
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-900">
                      Thời điểm bắt đầu phiên đấu giá:
                    </span>
                    <span className="text-teal-800">
                      {auctionDetailData.auctionStartDate
                        ? dayjs(auctionDetailData.auctionStartDate).format(
                            "DD/MM/YYYY"
                          )
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-900">
                      Thời điểm kết thúc phiên đấu giá:
                    </span>
                    <span className="text-teal-800">
                      {auctionDetailData.auctionEndDate
                        ? dayjs(auctionDetailData.auctionEndDate).format(
                            "DD/MM/YYYY"
                          )
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-900">
                      Số vòng quy định:
                    </span>
                    <span className="text-teal-800">
                      {auctionDetailData.numberRoundMax || "-"}
                    </span>
                  </div>
                  {auctionDetailData.winnerData && (
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-900">
                        Giá trúng:
                      </span>
                      <span className="text-teal-800">
                        {auctionDetailData.winnerData}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-900">
                      Tiền đặt trước:
                    </span>
                    <span className="text-teal-800">
                      {auctionDetailData.qrLink ? "500,000 VND" : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-900">
                      Đấu giá viên:
                    </span>
                    <span className="text-teal-800">
                      {auctionDetailData.auctioneerBy
                        ? auctionDetailData.auctioneerBy
                        : "-"}
                    </span>
                  </div>
                </div>
                {(role === USER_ROLES.MANAGER ||
                  role === USER_ROLES.AUCTIONEER) && (
                  <div className="flex justify-center gap-4 mt-6">
                    {role === USER_ROLES.AUCTIONEER && !isHaveAuctionRound && (
                      <Button
                        type="primary"
                        size="large"
                        className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-2 rounded-lg"
                        onClick={handleOpenModal}
                      >
                        Tạo vòng đấu giá
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mô tả tài sản và danh sách tài sản */}
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Thông tin chủ tài sản
              </h3>
              <p className="text-teal-700 mb-6 bg-blue-50 p-4 rounded-lg whitespace-pre-wrap leading-relaxed">
                {auctionDetailData.auctionDescription || "Không có mô tả."}
              </p>

              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Danh sách tài sản đấu giá
              </h3>
              {auctionDetailData.listAuctionAssets &&
              auctionDetailData.listAuctionAssets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {auctionDetailData.listAuctionAssets.map((asset) => (
                    <Card
                      key={asset.auctionAssetsId}
                      className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-blue-50 border border-teal-100"
                      title={
                        <div className="flex items-center justify-between">
                          <span className="text-base font-semibold text-blue-800">
                            {asset.tagName || "Tài sản không tên"}
                          </span>
                          <span className="text-sm text-teal-600">
                            {asset.unit ? `(${asset.unit})` : ""}
                          </span>
                        </div>
                      }
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-blue-900">
                            Giá khởi điểm:
                          </span>
                          <span className="text-teal-800">
                            {asset.startingPrice
                              ? `${parseFloat(
                                  asset.startingPrice
                                ).toLocaleString("vi-VN")} VND`
                              : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-blue-900">
                            Tiền đặt trước:
                          </span>
                          <span className="text-teal-800">
                            {asset.deposit
                              ? `${parseFloat(asset.deposit).toLocaleString(
                                  "vi-VN"
                                )} VND`
                              : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-blue-900">
                            Phí đăng ký:
                          </span>
                          <span className="text-teal-800">
                            {asset.registrationFee
                              ? `${parseFloat(
                                  asset.registrationFee
                                ).toLocaleString("vi-VN")} VND`
                              : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-blue-900">
                            Mô tả:
                          </span>
                          <span className="text-teal-700 text-right">
                            {asset.description || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-blue-900">
                            Ngày tạo:
                          </span>
                          <span className="text-teal-800">
                            {asset.createdAt
                              ? dayjs(asset.createdAt).format("DD/MM/YYYY")
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-teal-600 py-6 bg-blue-50 rounded-lg">
                  Không có tài sản đấu giá nào được liệt kê.
                </div>
              )}
            </div>

            {/* Điều khoản tuân thủ */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Điều khoản tuân thủ
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                {auctionDetailData.auctionRules ? (
                  <Typography.Link
                    href={auctionDetailData.auctionRules}
                    target="_blank"
                    className="text-teal-600"
                  >
                    Click để xem chi tiết
                  </Typography.Link>
                ) : (
                  <p className="text-teal-700">Không có điều khoản tuân thủ.</p>
                )}
              </div>
            </div>
            {/* Thông tin bản đồ */}
            {auctionDetailData.auctionMap ||
            auctionDetailData.auctionPlanningMap !== "No file uploaded" ? (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  Thông tin bản đồ tài sản
                </h3>
                <div className="bg-blue-50 border border-teal-100 rounded-xl hover:shadow-lg transition-shadow duration-300">
                  <div>
                    {auctionDetailData.auctionPlanningMap !==
                      "No file uploaded" && (
                      <div className="flex items-center bg-blue-50 pt-4 pl-4 rounded-lg">
                        <EnvironmentOutlined className="text-teal-600 mr-2" />
                        <Typography.Link
                          href={auctionDetailData.auctionPlanningMap}
                          target="_blank"
                          className="text-teal-600 font-medium hover:text-teal-800 "
                        >
                          Xem bản đồ tài sản
                        </Typography.Link>
                      </div>
                    )}
                    {auctionDetailData.auctionMap && (
                      <div className="flex items-center bg-blue-50 p-4 rounded-lg">
                        <EnvironmentOutlined className="text-teal-600 mr-2" />
                        <Typography.Link
                          href={
                            auctionType === "SQL"
                              ? auctionDetailData.auctionMap
                              : API_BASE_URL_NODE +
                                "/" +
                                auctionDetailData.auctionMap
                          }
                          target="_blank"
                          className="text-teal-600 font-medium hover:text-teal-800"
                        >
                          Xem trên Google Maps
                        </Typography.Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div className="text-center text-teal-600 py-6 bg-blue-50 rounded-lg">
            Đang tải dữ liệu...
          </div>
        )}
      </div>

      {/* Modal tạo vòng đấu giá */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-blue-800">
              Tạo vòng đấu giá mới
            </span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCloseModal}
        width={600}
        footer={null}
        destroyOnClose
        className="create-round-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <div className="space-y-4">
            <Form.Item
              name="priceMin"
              label={
                <span className="font-medium text-gray-700">
                  Bước giá tối thiểu (VND)
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập bước giá tối thiểu!",
                },
                {
                  type: "number",
                  min: 1000,
                  message: "Bước giá tối thiểu phải ít nhất 1,000 VND",
                },
                {
                  validator: (_, value) => {
                    if (value && value % 1000 !== 0) {
                      return Promise.reject(
                        "Không được nhập lẻ đến hàng trăm đồng"
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber
                placeholder="Nhập bước giá tối thiểu"
                size="large"
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                min={1000}
                step={1000}
              />
            </Form.Item>
            <Form.Item
              name="priceMax"
              label={
                <span className="font-medium text-gray-700">
                  Bước giá tối đa (VND)
                </span>
              }
              rules={[
                {
                  type: "number",
                  min: 1000,
                  message: "Giá tối đa phải ít nhất 1,000 VND",
                },
                {
                  validator: (_, value) => {
                    if (value && value % 1000 !== 0) {
                      return Promise.reject(
                        "Không được nhập lẻ đến hàng trăm đồng"
                      );
                    }
                    return Promise.resolve();
                  },
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const priceMin = getFieldValue("priceMin");
                    if (!value || !priceMin || value > priceMin) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Giá tối đa phải lớn hơn bước giá tối thiểu!")
                    );
                  },
                }),
              ]}
            >
              <InputNumber
                placeholder="Nhập giá tối đa"
                size="large"
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                min={1000}
                step={1000}
              />
            </Form.Item>
            <Form.Item
              name="totalPriceMax"
              label={
                <span className="font-medium text-gray-700">
                  Giá tối đa (VND)
                </span>
              }
              rules={[
                {
                  type: "number",
                  min: 1000,
                  message: "Bước giá tối đa phải ít nhất 1,000 VND",
                },
                {
                  validator: (_, value) => {
                    if (value && value % 1000 !== 0) {
                      return Promise.reject(
                        "Không được nhập lẻ đến hàng trăm đồng"
                      );
                    }
                    return Promise.resolve();
                  },
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const priceMin = getFieldValue("priceMin");
                    if (!value || !priceMin || value >= priceMin) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Bước giá tối đa phải lớn hơn hoặc bằng bước giá tối thiểu!"
                      )
                    );
                  },
                }),
              ]}
            >
              <InputNumber
                placeholder="Nhập bước giá tối đa"
                size="large"
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                min={1000}
                step={1000}
              />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <Button onClick={handleCloseModal} size="large" className="px-6">
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              size="large"
              className="bg-teal-500 hover:bg-teal-600 px-6"
            >
              {isSubmitting ? "Đang tạo..." : "Tạo vòng đấu giá"}
            </Button>
          </div>
        </Form>
      </Modal>
    </section>
  );
};

export default AuctionDetail;
