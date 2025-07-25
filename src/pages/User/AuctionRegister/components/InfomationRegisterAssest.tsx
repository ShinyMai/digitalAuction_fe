/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import type { AuctionAsset, UserInfomation } from "../../../Anonymous/Modals";
import { Form, Input, Button, Row, Col, Typography, DatePicker } from "antd";
import { useForm } from "antd/es/form/Form";
import {
  ArrowLeftOutlined,
  UserOutlined,
  IdcardOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  BankOutlined,
  CreditCardOutlined,
  DollarOutlined,
  SafetyOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import AuctionServices from "../../../../services/AuctionServices";
import { toast } from "react-toastify";
dayjs.locale("vi");
interface Props {
  auctionAssetsSelected?: AuctionAsset;
  onNext: () => void;
  onPrev: () => void;
  onSetDataPayment: (value: any) => void;
  userInfo: UserInfomation;
}

const InfomationRegisterAsset = ({
  auctionAssetsSelected,
  onNext,
  onPrev,
  onSetDataPayment,
  userInfo,
}: Props) => {
  const [form] = useForm();

  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue({
        name: userInfo.name,
        birthDay:
          userInfo.birthDay && dayjs(userInfo.birthDay).isValid() ? dayjs(userInfo.birthDay) : null,
        citizenIdentification: userInfo.citizenIdentification,
        issueDate:
          userInfo.issueDate && dayjs(userInfo.issueDate).isValid()
            ? dayjs(userInfo.issueDate)
            : null,
        issueBy: userInfo.issueBy,
        phoneNumber: userInfo.phoneNumber,
        originLocation: userInfo.originLocation,
        accountNumber: "",
        bankAccount: "",
        bankBranch: "",
      });
    }
  }, [userInfo, form]);

  const handleNext = async () => {
    try {
      const valueSubmit = {
        auctionAssetsId: auctionAssetsSelected?.auctionAssetsId,
        bankAccount: form.getFieldValue("bankAccount"),
        bankAccountNumber: form.getFieldValue("accountNumber"),
        bankBranch: form.getFieldValue("bankBranch"),
      };
      const response = await AuctionServices.registerAuctionAsset(valueSubmit);
      if (response.data) {
        onSetDataPayment(response.data);
        onNext();
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký tham gia đấu giá:", error);
      toast.error("Vui lòng điền đầy đủ thông tin!");
    }
  };

  const formatVND = (value: string) => {
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  };
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-200/20 rounded-full blur-xl animate-float"></div>
        <div
          className="absolute top-40 right-32 w-32 h-32 bg-purple-200/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/3 w-28 h-28 bg-indigo-200/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
            <div className="flex items-center justify-between">
              <Button
                type="text"
                icon={<ArrowLeftOutlined className="text-blue-600 text-xl" />}
                onClick={onPrev}
                className="p-4 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:scale-105"
              />
              <div className="text-center flex-1">
                <div className="inline-block p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                  <div className="bg-white px-6 py-2 rounded-xl">
                    <span className="text-sm font-semibold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
                      📝 THÔNG TIN ĐĂNG KÝ
                    </span>
                  </div>
                </div>
                <Typography.Title
                  level={2}
                  className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text font-bold"
                >
                  Đăng Ký Tham Gia Đấu Giá
                </Typography.Title>
                <p className="text-gray-600 mt-2">
                  Vui lòng điền đầy đủ thông tin để hoàn tất đăng ký
                </p>
              </div>
              <div className="w-16"></div>
            </div>
          </div>

          <Row gutter={[32, 32]}>
            {/* Enhanced Form Section */}
            <Col xs={24} lg={16}>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden p-8">
                <Form form={form} layout="vertical" className="p-8">
                  {/* Personal Information Section */}
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <UserOutlined className="text-white text-lg" />
                      </div>
                      <div>
                        <Typography.Title level={4} className="mb-0 text-gray-800">
                          Thông Tin Cá Nhân
                        </Typography.Title>
                        <p className="text-gray-500 text-sm mb-0">Thông tin định danh của bạn</p>
                      </div>
                    </div>

                    <Row gutter={[24, 24]}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Họ và tên"
                          name="name"
                          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                        >
                          <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="Nhập họ và tên"
                            className="h-12 rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors duration-300"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Ngày sinh"
                          name="birthDay"
                          rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
                        >
                          <DatePicker
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày sinh"
                            className="w-full h-12 rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors duration-300"
                            suffixIcon={<CalendarOutlined className="text-gray-400" />}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Số CCCD"
                          name="citizenIdentification"
                          rules={[{ required: true, message: "Vui lòng nhập số CCCD!" }]}
                        >
                          <Input
                            prefix={<IdcardOutlined className="text-gray-400" />}
                            placeholder="Nhập số CCCD"
                            className="h-12 rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors duration-300"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Ngày cấp"
                          name="issueDate"
                          rules={[{ required: true, message: "Vui lòng chọn ngày cấp!" }]}
                        >
                          <DatePicker
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày cấp"
                            className="w-full h-12 rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors duration-300"
                            suffixIcon={<CalendarOutlined className="text-gray-400" />}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Nơi cấp"
                          name="issueBy"
                          rules={[{ required: true, message: "Vui lòng nhập nơi cấp!" }]}
                        >
                          <Input
                            prefix={<EnvironmentOutlined className="text-gray-400" />}
                            placeholder="Nhập nơi cấp"
                            className="h-12 rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors duration-300"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Số điện thoại"
                          name="phoneNumber"
                          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                        >
                          <Input
                            prefix={<PhoneOutlined className="text-gray-400" />}
                            placeholder="Nhập số điện thoại"
                            className="h-12 rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors duration-300"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          label="Hộ khẩu thường trú"
                          name="originLocation"
                          rules={[{ required: true, message: "Vui lòng nhập hộ khẩu thường trú!" }]}
                        >
                          <Input.TextArea
                            placeholder="Nhập hộ khẩu thường trú"
                            rows={3}
                            className="rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors duration-300"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>

                  {/* Banking Information Section */}
                  <div>
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <BankOutlined className="text-white text-lg" />
                      </div>
                      <div>
                        <Typography.Title level={4} className="mb-0 text-gray-800">
                          Tài Khoản Nhận Lại Tiền Cọc
                        </Typography.Title>
                        <p className="text-gray-500 text-sm mb-0">
                          Thông tin ngân hàng để hoàn trả tiền cọc
                        </p>
                      </div>
                    </div>

                    <Row gutter={[24, 24]}>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Số tài khoản" name="accountNumber">
                          <Input
                            prefix={<CreditCardOutlined className="text-gray-400" />}
                            placeholder="Nhập số tài khoản"
                            className="h-12 rounded-xl border-gray-200 hover:border-green-400 focus:border-green-500 transition-colors duration-300"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item label="Tên ngân hàng" name="bankAccount">
                          <Input
                            prefix={<BankOutlined className="text-gray-400" />}
                            placeholder="Nhập tên ngân hàng"
                            className="h-12 rounded-xl border-gray-200 hover:border-green-400 focus:border-green-500 transition-colors duration-300"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item label="Tên chi nhánh mở tài khoản" name="bankBranch">
                          <Input
                            prefix={<EnvironmentOutlined className="text-gray-400" />}
                            placeholder="Nhập tên chi nhánh mở tài khoản"
                            className="h-12 rounded-xl border-gray-200 hover:border-green-400 focus:border-green-500 transition-colors duration-300"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </div>
            </Col>

            {/* Enhanced Asset Information Section */}
            <Col xs={24} lg={8}>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden h-fit">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <DollarOutlined className="text-white" />
                    </div>
                    <Typography.Title level={4} className="text-white mb-0">
                      Tài Sản Đã Chọn
                    </Typography.Title>
                  </div>
                  <p className="text-purple-100 text-sm mb-0">Thông tin tài sản tham gia đấu giá</p>
                </div>

                <div className="p-6">
                  {auctionAssetsSelected ? (
                    <div className="space-y-6">
                      {/* Asset Header */}
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                          <DollarOutlined className="text-white text-2xl" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">
                          {auctionAssetsSelected.tagName || "Tài sản không tên"}
                        </h4>
                        {auctionAssetsSelected.unit && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            {auctionAssetsSelected.unit}
                          </span>
                        )}
                      </div>

                      {/* Asset Details */}
                      <div className="space-y-4">
                        {[
                          {
                            label: "Giá khởi điểm",
                            value: formatVND(auctionAssetsSelected.startingPrice || "0"),
                            color: "blue",
                            icon: <DollarOutlined />,
                          },
                          {
                            label: "Tiền đặt trước",
                            value: formatVND(auctionAssetsSelected.deposit || "0"),
                            color: "green",
                            icon: <SafetyOutlined />,
                          },
                          {
                            label: "Phí đăng ký",
                            value: formatVND(auctionAssetsSelected.registrationFee || "0"),
                            color: "purple",
                            icon: <CreditCardOutlined />,
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className={`bg-gradient-to-r from-${item.color}-50 to-${item.color}-100 p-4 rounded-xl border border-${item.color}-200`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 bg-${item.color}-500/20 rounded-lg flex items-center justify-center`}
                                >
                                  <span className={`text-${item.color}-600`}>{item.icon}</span>
                                </div>
                                <span className="font-semibold text-gray-700">{item.label}</span>
                              </div>
                              <span
                                className={`font-bold text-${item.color}-700 bg-white/70 px-3 py-1 rounded-lg text-sm`}
                              >
                                {item.value}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Additional Info */}
                      {auctionAssetsSelected.description && (
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mt-1">
                              <UserOutlined className="text-gray-600 text-sm" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-700 mb-1">Mô tả</h5>
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {auctionAssetsSelected.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Creation Date */}
                      <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <CalendarOutlined className="mr-2" />
                        Ngày tạo: {dayjs(auctionAssetsSelected.createdAt).format("DD/MM/YYYY")}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <DollarOutlined className="text-gray-400 text-2xl" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-600 mb-2">
                        Chưa chọn tài sản
                      </h4>
                      <p className="text-gray-500 text-sm">Vui lòng quay lại và chọn tài sản</p>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>

          {/* Enhanced Action Button */}
          <div className="text-center mt-8">
            <div className="inline-block p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Sẵn sàng tiếp tục?</h4>
              <Button
                type="primary"
                size="large"
                onClick={handleNext}
                className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 border-0 px-8 py-6 h-auto text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center gap-3">
                  <CheckCircleOutlined className="text-xl" />
                  Tiếp Theo - Thanh Toán
                  <ArrowLeftOutlined className="text-lg rotate-180" />
                </span>
              </Button>
              <p className="text-gray-500 mt-4 text-sm">
                Thông tin của bạn sẽ được bảo mật và sử dụng theo quy định
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// const formatVND = (value: string) => {
//   const number = parseFloat(value);
//   if (isNaN(number)) return value;
//   return new Intl.NumberFormat("vi-VN", {
//     style: "currency",
//     currency: "VND",
//   }).format(number);
// };

export default InfomationRegisterAsset;
