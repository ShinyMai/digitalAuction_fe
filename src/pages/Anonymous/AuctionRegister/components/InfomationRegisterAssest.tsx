/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import type {
  AuctionAsset,
  UserInfomation,
} from "../../Modals";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  DatePicker,
  Card,
} from "antd";
import { useForm } from "antd/es/form/Form";
import {
  ArrowLeftOutlined,
  PictureOutlined,
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
          userInfo.birthDay &&
          dayjs(userInfo.birthDay).isValid()
            ? dayjs(userInfo.birthDay)
            : null,
        citizenIdentification:
          userInfo.citizenIdentification,
        issueDate:
          userInfo.issueDate &&
          dayjs(userInfo.issueDate).isValid()
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
        auctionAssetsId:
          auctionAssetsSelected?.auctionAssetsId,
        bankAccount: form.getFieldValue("bankAccount"),
        bankAccountNumber:
          form.getFieldValue("accountNumber"),
        bankBranch: form.getFieldValue("bankBranch"),
      };
      const response =
        await AuctionServices.registerAuctionAsset(
          valueSubmit
        );
      if (response.data) {
        onSetDataPayment(response.data);
        onNext();
      } else {
        toast.error(
          "Bạn đã đăng ký tham gia đấu giá với tài sản này !"
        );
      }
    } catch (error) {
      console.error(
        "Lỗi khi đăng ký tham gia đấu giá:",
        error
      );
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
    <section className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-teal-50 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            type="text"
            icon={
              <ArrowLeftOutlined className="text-blue-800 text-lg" />
            }
            onClick={onPrev}
            className="p-0 hover:bg-blue-100"
          />
          <Typography.Title
            level={2}
            className="text-center text-blue-800 flex-1"
          >
            Đăng Ký Tham Gia Đấu Giá
          </Typography.Title>
          <div className="w-10"></div>
        </div>

        <Row gutter={[24, 24]} className="mb-6">
          <Col xs={24} md={16}>
            <Form
              form={form}
              layout="vertical"
              className="bg-blue-50 p-6 rounded-lg shadow-md"
            >
              <Typography.Title
                level={4}
                className="text-blue-800 mb-4 px-2"
              >
                Thông Tin Cá Nhân
              </Typography.Title>
              <Row gutter={16} className="p-2">
                <Col span={12}>
                  <Form.Item
                    label="Họ và tên:"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập họ và tên!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập họ và tên"
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Sinh ngày:"
                    name="birthDay"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày sinh!",
                      },
                    ]}
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      placeholder="Chọn ngày sinh"
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="CCCD số:"
                    name="citizenIdentification"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số CCCD!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập số CCCD"
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Cấp ngày:"
                    name="issueDate"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày cấp!",
                      },
                    ]}
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      placeholder="Chọn ngày cấp"
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Nơi cấp:"
                    name="issueBy"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập nơi cấp!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập nơi cấp"
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Điện thoại:"
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message:
                          "Vui lòng nhập số điện thoại!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập số điện thoại"
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Hộ khẩu thường trú:"
                    name="originLocation"
                    rules={[
                      {
                        required: true,
                        message:
                          "Vui lòng nhập hộ khẩu thường trú!",
                      },
                    ]}
                  >
                    <Input.TextArea
                      placeholder="Nhập hộ khẩu thường trú"
                      rows={3}
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Typography.Title
                level={4}
                className="text-blue-800 mt-6 mb-4 px-2"
              >
                Tài Khoản Nhận Lại Tiền Cọc
              </Typography.Title>
              <Row gutter={16} className="p-2">
                <Col span={12}>
                  <Form.Item
                    label="Số tài khoản:"
                    name="accountNumber"
                    rules={[
                      {
                        required: true,
                        message:
                          "Vui lòng nhập số tài khoản!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập số tài khoản"
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Tên ngân hàng:"
                    name="bankAccount"
                    rules={[
                      {
                        required: true,
                        message:
                          "Vui lòng nhập tên ngân hàng!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập tên ngân hàng"
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Tên chi nhánh mở tài khoản:"
                    name="bankBranch"
                    rules={[
                      {
                        required: true,
                        message:
                          "Vui lòng nhập tên chi nhánh!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập tên chi nhánh mở tài khoản"
                      className="w-full"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>

          <Col xs={24} md={8}>
            <div className="bg-blue-50 p-4 rounded-lg shadow-md h-full">
              <Typography.Title
                level={4}
                className="text-blue-800 mb-4"
              >
                Tài Sản Đã Chọn
              </Typography.Title>
              {auctionAssetsSelected ? (
                <Card className="border border-teal-200 hover:shadow-xl transition-shadow duration-300">
                  <Card.Meta
                    title={
                      <Typography.Text
                        strong
                        className="text-teal-700 text-lg"
                      >
                        {auctionAssetsSelected.tagName ||
                          "Tài sản không tên"}
                      </Typography.Text>
                    }
                    description={
                      <div className="space-y-2 text-gray-600">
                        <p>
                          <span className="font-semibold">
                            Giá khởi điểm:
                          </span>{" "}
                          {formatVND(
                            auctionAssetsSelected.startingPrice ||
                              "0"
                          )}
                        </p>
                        <p>
                          <span className="font-semibold">
                            Tiền đặt trước:
                          </span>{" "}
                          {formatVND(
                            auctionAssetsSelected.deposit ||
                              "0"
                          )}
                        </p>
                        <p>
                          <span className="font-semibold">
                            Phí đăng ký:
                          </span>{" "}
                          {formatVND(
                            auctionAssetsSelected.registrationFee ||
                              "0"
                          )}
                        </p>
                        <p>
                          <span className="font-semibold">
                            Đơn vị:
                          </span>{" "}
                          {auctionAssetsSelected.unit ||
                            "-"}
                        </p>
                        <p>
                          <span className="font-semibold">
                            Mô tả:
                          </span>{" "}
                          {auctionAssetsSelected.description ||
                            "Không có mô tả"}
                        </p>
                        <p>
                          <span className="font-semibold">
                            Ngày tạo:
                          </span>{" "}
                          {dayjs(
                            auctionAssetsSelected.createdAt
                          ).format("DD/MM/YYYY")}
                        </p>
                      </div>
                    }
                  />
                </Card>
              ) : (
                <div className="text-center text-teal-600 py-8 bg-gray-50 rounded-lg">
                  <PictureOutlined className="text-3xl mb-2" />
                  <p>Chưa chọn tài sản nào</p>
                </div>
              )}
            </div>
          </Col>
        </Row>

        <div className="mt-6 flex justify-center">
          <Button
            type="primary"
            className="bg-teal-500 hover:bg-teal-600"
            onClick={handleNext}
          >
            Tiếp Theo
          </Button>
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
