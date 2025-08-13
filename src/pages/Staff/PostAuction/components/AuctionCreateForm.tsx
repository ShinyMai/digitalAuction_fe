/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Tooltip,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useState, useEffect } from "react";
import UploadFile from "./Upload";
import { useFormFileUpload } from "./useFormFileUpload";
import type { AuctionCategory } from "../../Modals.ts";
import dayjs, { Dayjs } from "dayjs";
import AuctionServices from "../../../../services/AuctionServices/index.tsx";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { QuestionCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

// Định nghĩa interface cho dữ liệu form
interface AuctionFormValues {
  AuctionName: string;
  CategoryId: number;
  NumberRoundMax: number;
  RegisterTimeRange?: [Dayjs, Dayjs];
  AuctionTimeRange?: [Dayjs, Dayjs];
  AuctionAssetFile?: {
    originFileObj: File;
    name: string;
  }[];
  AuctionRulesFile?: {
    originFileObj: File;
    name: string;
  }[];
  AuctionPlanningMap?: {
    originFileObj: File;
    name: string;
  }[];
  AuctionDescription?: string;
  AuctionMap?: string;
}

interface Props {
  auctionCategoryList: AuctionCategory[];
  auctionType: "NODE" | "SQL";
  handleBackToSelection: () => void;
}

const REAL_ESTATE_CATEGORY_ID = 2; // Hằng số cho danh mục bất động sản

const AuctionCreateForm = ({
  auctionCategoryList,
  auctionType,
  handleBackToSelection,
}: Props) => {
  const [form] = useForm<AuctionFormValues>();
  const [isRealEstate, setIsRealEstate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registerRange, setRegisterRange] = useState<[Dayjs, Dayjs] | null>(
    null
  );

  // File upload hooks
  const auctionAssetUpload = useFormFileUpload("AuctionAssetFile", form);
  const auctionRulesUpload = useFormFileUpload("AuctionRulesFile", form);
  const auctionPlanningUpload = useFormFileUpload("AuctionPlanningMap", form);

  const { user } = useSelector((state: any) => state.auth);
  const CreatedBy = user?.id || "defaultUser";

  // Chuyển danh sách danh mục thành options cho Select
  const dataAuctionCategoryList = auctionCategoryList.map((val) => ({
    value: val.categoryId,
    label: val.categoryName,
  }));

  // Lấy ngày hiện tại
  const currentDate = dayjs();

  // Hàm vô hiệu hóa ngày cho RangePicker thời gian đăng ký
  const disabledRegisterDate = (current: Dayjs) => {
    return current.isBefore(currentDate.startOf("day"));
  };

  // Hàm vô hiệu hóa ngày cho RangePicker thời gian đấu giá
  const disabledAuctionDate = (current: Dayjs) => {
    if (!registerRange || !registerRange[1]) return true;
    const registerEndDate = registerRange[1];
    const minAuctionStart = registerEndDate.add(1, "day"); // Ngày bắt đầu tối thiểu (1 ngày sau)
    return current.isBefore(minAuctionStart);
  };
  // Hàm tạo FormData từ form values và các file
  const createFormData = (formValues: {
    AuctionName?: string;
    CategoryId?: number;
    RegisterOpenDate?: string;
    RegisterEndDate?: string;
    AuctionStartDate?: string;
    AuctionEndDate?: string;
    NumberRoundMax?: number;
    AuctionDescription?: string;
    AuctionAssetFile: File;
    AuctionRulesFile: File;
    AuctionPlanningMap?: File;
    AuctionMap?: any;
  }): FormData => {
    const formData = new FormData();

    // Define the fields to include in FormData
    const fields = {
      AuctionName: formValues.AuctionName,
      CategoryId: formValues.CategoryId,
      RegisterOpenDate: formValues.RegisterOpenDate,
      RegisterEndDate: formValues.RegisterEndDate,
      AuctionStartDate: formValues.AuctionStartDate,
      AuctionEndDate: formValues.AuctionEndDate,
      NumberRoundMax: formValues.NumberRoundMax,
      AuctionDescription: formValues.AuctionDescription,
      Auction_Map: formValues.AuctionMap,
    };

    // Append non-file fields to FormData
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : value.toString()
        );
      }
    });

    // Append required files
    if (formValues.AuctionAssetFile) {
      formData.append("AuctionAssetFile", formValues.AuctionAssetFile);
    } else {
      console.error("AuctionAssetFile is missing!");
    }

    if (formValues.AuctionRulesFile) {
      formData.append("AuctionRulesFile", formValues.AuctionRulesFile);
    } else {
      console.error("AuctionRulesFile is missing!");
    }

    // Append optional file if it exists
    if (formValues.AuctionPlanningMap) {
      formData.append("AuctionPlanningMap", formValues.AuctionPlanningMap);
    }
    return formData;
  };

  useEffect(() => {
    if (registerRange && form.getFieldValue("AuctionTimeRange")) {
      const [auctionStartDate] = form.getFieldValue("AuctionTimeRange") || [];
      const registerEndDate = registerRange[1];
      const minAuctionStart = registerEndDate.add(1, "day");
      if (dayjs(auctionStartDate).isBefore(minAuctionStart)) {
        form.setFieldValue("AuctionTimeRange", null);
      }
    }
  }, [registerRange, form]);
  // Hàm xử lý submit form
  const onFinish = async (values: AuctionFormValues) => {
    setLoading(true);

    try {
      // Lấy file theo nhiều cách khác nhau để đảm bảo
      let auctionAssetFile = values.AuctionAssetFile?.[0]?.originFileObj;
      let auctionRulesFile = values.AuctionRulesFile?.[0]?.originFileObj;
      const auctionPlanningMap = values.AuctionPlanningMap?.[0]?.originFileObj;

      // Fallback nếu originFileObj không có
      if (!auctionAssetFile && values.AuctionAssetFile?.[0]) {
        auctionAssetFile = values.AuctionAssetFile[0] as unknown as File;
      }
      if (!auctionRulesFile && values.AuctionRulesFile?.[0]) {
        auctionRulesFile = values.AuctionRulesFile[0] as unknown as File;
      }

      if (!auctionAssetFile || !auctionRulesFile) {
        console.error("File validation failed:", {
          hasAuctionAssetFile: !!auctionAssetFile,
          hasAuctionRulesFile: !!auctionRulesFile,
          AuctionAssetFileArray: values.AuctionAssetFile,
          AuctionRulesFileArray: values.AuctionRulesFile,
        });
        toast.error("Vui lòng tải lên đầy đủ các tệp bắt buộc!");
        setLoading(false);
        return;
      }

      // Kiểm tra thời gian
      const [registerOpenDate, registerEndDate] =
        values.RegisterTimeRange || [];
      const [auctionStartDate, auctionEndDate] = values.AuctionTimeRange || [];
      if (
        !registerOpenDate ||
        !registerEndDate ||
        !auctionStartDate ||
        !auctionEndDate
      ) {
        toast.error("Vui lòng chọn đầy đủ thời gian đăng ký và đấu giá!");
        return;
      }

      const registerStart = dayjs(registerOpenDate);
      const auctionStart = dayjs(auctionStartDate);
      const dayDifferStart = auctionStart.diff(registerStart, "day");
      if (dayDifferStart < 7) {
        toast.error(
          "Thời gian bắt đầu đấu giá phải trước thời gian bắt đầu đăng ký tham gia ít nhất 7 ngày!"
        );
        setLoading(false);
        return;
      }
      const formattedValues = {
        ...values,
        AuctionAssetFile: auctionAssetFile,
        AuctionRulesFile: auctionRulesFile,
        AuctionPlanningMap: auctionPlanningMap,
        RegisterOpenDate: dayjs(registerOpenDate).format("YYYY-MM-DD HH:00:00"),
        RegisterEndDate: dayjs(registerEndDate).format("YYYY-MM-DD HH:00:00"),
        AuctionStartDate: dayjs(auctionStartDate).format("YYYY-MM-DD HH:00:00"),
        AuctionEndDate: dayjs(auctionEndDate).format("YYYY-MM-DD HH:00:00"),
      };

      // Xóa các trường range picker
      delete formattedValues.RegisterTimeRange;
      delete formattedValues.AuctionTimeRange;

      const formData = createFormData(formattedValues);
      if (auctionType === "SQL") {
        await AuctionServices.addAuction(formData);
      }

      if (auctionType === "NODE") {
        formData.append("CreatedBy", CreatedBy);
        await AuctionServices.addAuctionNode(formData);
      }

      toast.success("Tạo đấu giá thành công!");
    } catch (error: any) {
      toast.error("Lỗi khi tạo đấu giá:", error);
      let errorMessage = "Lỗi hệ thống, vui lòng thử lại!";
      if (error.response?.status === 401) {
        errorMessage = "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!";
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.message || "Dữ liệu không hợp lệ!";
      } else if (error.message === "Network Error") {
        errorMessage = "Lỗi kết nối mạng, vui lòng kiểm tra kết nối!";
      }
      toast.error(`Tạo đấu giá thất bại: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tải file mẫu định dạng tài sản
  const handleDownloadTemplate = () => {
    try {
      const templateData = [
        {
          "Tên nhãn (Tag_Name)": "Máy xúc",
          "Giá khởi điểm (starting_price)": "100,000,000",
          "Đơn vị (Unit)": "Cái",
          "Tiền đặt cọc (Deposit)": "10,000,000",
          "Phí đăng ký (Registration_fee)": "500,000",
          "Mô tả (Description)": "Máy xúc đã qua sử dụng, còn hoạt động tốt",
        },
        {
          "Tên nhãn (Tag_Name)": "Xe tải",
          "Giá khởi điểm (starting_price)": "150,000,000",
          "Đơn vị (Unit)": "Chiếc",
          "Tiền đặt cọc (Deposit)": "15,000,000",
          "Phí đăng ký (Registration_fee)": "700,000",
          "Mô tả (Description)": "Xe tải trọng tải 5 tấn, đời 2018",
        },
        {
          "Tên nhãn (Tag_Name)": "Máy khoan",
          "Giá khởi điểm (starting_price)": "50,000,000",
          "Đơn vị (Unit)": "Bộ",
          "Tiền đặt cọc (Deposit)": "5,000,000",
          "Phí đăng ký (Registration_fee)": "300,000",
          "Mô tả (Description)": "Máy khoan điện, đầy đủ phụ kiện",
        },
      ];
      const ws = XLSX.utils.json_to_sheet(templateData, {
        header: [
          "Tên nhãn (Tag_Name)",
          "Giá khởi điểm (starting_price)",
          "Đơn vị (Unit)",
          "Tiền đặt cọc (Deposit)",
          "Phí đăng ký (Registration_fee)",
          "Mô tả (Description)",
        ],
      });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "AuctionAssets");
      XLSX.writeFile(wb, "Mau_Thong_Tin_Dau_Gia_DinhDang.xlsx");
      toast.success("Tải file mẫu thành công!");
    } catch (error) {
      toast.error("Lỗi khi tải file mẫu!");
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="!p-6"
    >
      <Card className="!shadow-lg !border-0 !bg-gradient-to-r !from-blue-50 !to-teal-50">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={handleBackToSelection}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Quay lại
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-center flex-1">
            Tạo Đấu Giá Mới -{" "}
            {auctionType === "NODE" ? "Theo lô" : "Từng tài sản"}
          </h1>
          <div className="w-20"></div>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="!space-y-4"
          onFinishFailed={() => {
            message.error("Vui lòng kiểm tra các trường bắt buộc!");
          }}
          onValuesChange={(changedValues) => {
            if (changedValues.RegisterTimeRange) {
              setRegisterRange(changedValues.RegisterTimeRange);
            }
          }}
        >
          <Row gutter={[24, 16]}>
            {/* Basic Information */}
            <Col span={24}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="!text-lg !font-semibold !text-blue-800 !mb-4 !border-b !border-blue-200 !pb-2">
                  Thông tin cơ bản
                </h3>
              </motion.div>
            </Col>

            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Form.Item
                  name="AuctionName"
                  label={
                    <span className="!font-medium !text-blue-900">
                      Tên đấu giá
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập tên đấu giá!" },
                  ]}
                >
                  <Input
                    placeholder="Nhập tên đấu giá"
                    className="!rounded-lg !border-blue-200 hover:!border-blue-400 focus:!border-blue-500"
                    size="large"
                  />
                </Form.Item>
              </motion.div>
            </Col>

            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Form.Item
                  name="CategoryId"
                  label={
                    <span className="!font-medium !text-blue-900">
                      Danh mục tài sản
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng chọn danh mục!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn danh mục"
                    options={dataAuctionCategoryList}
                    className="!rounded-lg"
                    size="large"
                    onSelect={(val) =>
                      setIsRealEstate(val === REAL_ESTATE_CATEGORY_ID)
                    }
                  />
                </Form.Item>
              </motion.div>
            </Col>

            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Form.Item
                  name="NumberRoundMax"
                  label={
                    <span className="!font-medium !text-blue-900">
                      Số vòng tối đa
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số vòng tối đa!",
                    },
                    {
                      validator: (_, value) => {
                        const num = Number(value);
                        if (isNaN(num) || num < 1 || num > 5) {
                          return Promise.reject(
                            new Error("Số vòng tối đa phải từ 1 đến 5 vòng!")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    type="number"
                    placeholder="Nhập số vòng tối đa (1-5)"
                    className="!rounded-lg !border-blue-200 hover:!border-blue-400 focus:!border-blue-500"
                    size="large"
                    min={1}
                    max={5}
                  />
                </Form.Item>
              </motion.div>
            </Col>

            <Col span={24}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Form.Item
                  name="AuctionDescription"
                  label={
                    <span className="!font-medium !text-blue-900">
                      Thông tin chi tiết tài sản
                    </span>
                  }
                  rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Nhập thông tin chi tiết tài sản"
                    className="!rounded-lg !border-blue-200 hover:!border-blue-400 focus:!border-blue-500"
                  />
                </Form.Item>
              </motion.div>
            </Col>

            {/* Date Settings */}
            <Col span={24}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="!text-lg !font-semibold !text-blue-800 !mb-4 !border-b !border-blue-200 !pb-2">
                  Thiết lập thời gian
                </h3>
              </motion.div>
            </Col>

            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Form.Item
                  name="RegisterTimeRange"
                  label={
                    <span className="!font-medium !text-blue-900">
                      Thời gian đăng ký (Từ - Đến)
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn thời gian đăng ký!",
                    },
                  ]}
                >
                  <DatePicker.RangePicker
                    placeholder={["Ngày mở đăng ký", "Hạn đăng ký"]}
                    className="!w-full !rounded-lg !border-blue-200 hover:!border-blue-400 focus:!border-blue-500"
                    size="large"
                    format="DD/MM/YYYY HH:mm"
                    showTime={{ format: "HH" }}
                    disabledDate={disabledRegisterDate}
                  />
                </Form.Item>
              </motion.div>
            </Col>

            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Form.Item
                  name="AuctionTimeRange"
                  label={
                    <span className="!font-medium !text-blue-900">
                      Thời gian đấu giá (Từ - Đến)
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn thời gian đấu giá!",
                    },
                  ]}
                >
                  <DatePicker.RangePicker
                    placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                    className="!w-full !rounded-lg !border-blue-200 hover:!border-blue-400 focus:!border-blue-500"
                    size="large"
                    format="DD/MM/YYYY HH:mm"
                    showTime={{ format: "HH" }}
                    disabledDate={disabledAuctionDate}
                    disabled={!registerRange}
                  />
                </Form.Item>
              </motion.div>
            </Col>

            {/* File Uploads */}
            <Col span={24}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="!text-lg !font-semibold !text-blue-800 !mb-4 !border-b !border-blue-200 !pb-2">
                  Tải lên tài liệu
                </h3>
              </motion.div>
            </Col>

            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Form.Item
                  name="AuctionAssetFile"
                  label={
                    <div className="flex items-center justify-between">
                      <span className="!font-medium !text-blue-900 flex items-center">
                        Tệp tài sản đấu giá
                        <Tooltip
                          title="Chỉ nhận file đúng định dạng như file mẫu"
                          placement="top"
                        >
                          <QuestionCircleOutlined className="ml-2 text-blue-500 cursor-pointer" />
                        </Tooltip>
                      </span>
                    </div>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng tải lên tệp tài sản!",
                    },
                    {
                      validator: (_, value) => {
                        if (!value || value.length === 0) {
                          return Promise.reject(
                            new Error("Vui lòng tải lên tệp tài sản!")
                          );
                        }
                        const file = value[0];
                        if (!file.originFileObj && !file.name) {
                          return Promise.reject(
                            new Error("File không hợp lệ!")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <div className="space-y-3">
                    <UploadFile
                      contentName="AuctionAssetFile"
                      onChange={auctionAssetUpload.onChange}
                    />
                    <div
                      className="cursor-pointer text-blue-500 hover:text-blue-700 underline text-sm"
                      onClick={handleDownloadTemplate}
                    >
                      📁 Tải mẫu danh sách tài sản
                    </div>
                  </div>
                </Form.Item>
              </motion.div>
            </Col>

            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <Form.Item
                  name="AuctionRulesFile"
                  label={
                    <span className="!font-medium !text-blue-900">
                      Tệp quy tắc đấu giá
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng tải lên tệp quy tắc!",
                    },
                    {
                      validator: (_, value) => {
                        if (!value || value.length === 0) {
                          return Promise.reject(
                            new Error("Vui lòng tải lên tệp quy tắc!")
                          );
                        }
                        const file = value[0];
                        if (!file.originFileObj && !file.name) {
                          return Promise.reject(
                            new Error("File không hợp lệ!")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <UploadFile
                    contentName="AuctionRulesFile"
                    onChange={auctionRulesUpload.onChange}
                  />
                </Form.Item>
              </motion.div>
            </Col>

            {/* Conditional Real Estate Fields */}
            {isRealEstate && (
              <>
                <Col xs={24} lg={12}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    <Form.Item
                      name="AuctionPlanningMap"
                      label={
                        <span className="!font-medium !text-blue-900">
                          Bản đồ kế hoạch đấu giá
                        </span>
                      }
                      valuePropName="fileList"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng tải lên bản đồ kế hoạch!",
                        },
                      ]}
                    >
                      <UploadFile
                        contentName="AuctionPlanningMap"
                        onChange={auctionPlanningUpload.onChange}
                      />
                    </Form.Item>
                  </motion.div>
                </Col>

                <Col xs={24} lg={12}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <Form.Item
                      name="AuctionMap"
                      label={
                        <span className="!font-medium !text-blue-900">
                          Gắn link trên bản đồ
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Gắn link vị trí trên bản đồ!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Gắn link vị trí trên bản đồ"
                        className="!rounded-lg !border-blue-200 hover:!border-blue-400 focus:!border-blue-500"
                        size="large"
                      />
                    </Form.Item>
                  </motion.div>
                </Col>
              </>
            )}

            {/* Submit Button */}
            <Col span={24}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="!flex !justify-center !mt-8"
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                  size="large"
                  className="!bg-gradient-to-r !from-blue-500 !to-teal-500 !border-0 hover:!from-blue-600 hover:!to-teal-600 !shadow-lg hover:!shadow-xl !transition-all !duration-300 !px-12 !h-12 !rounded-lg !font-semibold"
                >
                  Tạo Đấu Giá
                </Button>
              </motion.div>
            </Col>
          </Row>
        </Form>
      </Card>
    </motion.div>
  );
};

export default AuctionCreateForm;
