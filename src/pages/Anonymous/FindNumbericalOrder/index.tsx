/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, Card, message } from "antd";
import { IdcardOutlined } from "@ant-design/icons";
import UserServices from "../../../services/UserServices";
import CustomModal from "../../../components/Common/CustomModal";
import { useState } from "react";
import { toast } from "react-toastify";

interface AuctionResponse {
  auctionName: string;
  numericalOrder: number;
}

const FindNumbericalOrder = () => {
  const [form] = Form.useForm();
  const urlParams = new URLSearchParams(window.location.search).get(
    "auctionId"
  );
  const [isShow, setIsShow] = useState(false);
  const [auctionInfo, setAuctionInfo] = useState<AuctionResponse | null>(null);

  const extractErrMsg = (e: unknown) => {
    const err = e as any;
    return (
      err?.response?.data?.message ?? // axios/fetch error body
      err?.response?.data?.msg ?? // vài backend dùng "msg"
      err?.data?.message ?? // trường hợp service bọc lỗi
      err?.message ?? // fallback message
      "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
    );
  };

  const handleSubmit = async (values: { cccd: string }) => {
    try {
      const res = await UserServices.getNumbericalOrder(
        urlParams || "",
        values.cccd
      );
      if (res.code === 200) {
        setAuctionInfo(res.data as AuctionResponse);
        setIsShow(true);
      } else {
        message.error(res.message || "Không tìm thấy thông tin!");
      }
    } catch (error) {
      toast.error(extractErrMsg(error));
    }
  };

  const validateCCCD = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject("Vui lòng nhập số CCCD!");
    }

    if (!/^\d{12}$/.test(value)) {
      return Promise.reject("CCCD phải có đúng 12 chữ số!");
    }

    return Promise.resolve();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg rounded-lg">
          <div className="text-center mb-8">
            <IdcardOutlined className="text-4xl text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">
              Tra cứu số điểm danh
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Nhập số CCCD/CMND để tra cứu số điểm danh đấu giá của bạn
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              name="cccd"
              rules={[{ validator: validateCCCD }]}
              validateTrigger="onBlur"
            >
              <Input
                type="number"
                prefix={<IdcardOutlined className="text-gray-400" />}
                placeholder="Nhập số CCCD/CMND"
                size="large"
                maxLength={12}
                className="rounded-lg"
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 12);
                  form.setFieldValue("cccd", value);
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                Tìm kiếm
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-4 text-xs text-gray-500">
            <p>Lưu ý:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>CCCD/CMND phải có đúng 12 chữ số</li>
              <li>Chỉ được nhập số, không được nhập ký tự đặc biệt</li>
              <li>Thông tin của bạn sẽ được bảo mật</li>
            </ul>
          </div>
        </Card>
      </div>
      {isShow && auctionInfo && (
        <CustomModal
          open={isShow}
          onCancel={() => {
            setIsShow(false);
            setAuctionInfo(null);
          }}
          footer={null}
          width={400}
          title="Số điểm danh đấu giá"
          style={{ top: 60 }}
        >
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Phiên đấu giá: {auctionInfo.auctionName}
            </h3>
            <div className="text-3xl font-bold text-blue-600 my-4">
              Số điểm danh: {auctionInfo.numericalOrder}
            </div>
            <p className="text-gray-600 mb-4">
              Vui lòng đến bàn điểm danh có số thứ tự trên để điểm danh
            </p>
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default FindNumbericalOrder;
