/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select, Tooltip } from "antd";
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
import { QuestionCircleOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

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
}

const REAL_ESTATE_CATEGORY_ID = 2; // Hằng số cho danh mục bất động sản

const AuctionCreateForm = ({ auctionCategoryList, auctionType }: Props) => {
  const [form] = useForm<AuctionFormValues>();
  const [isRealEstate, setIsRealEstate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registerRange, setRegisterRange] = useState<[Dayjs, Dayjs] | null>(null);

  // File upload hooks
  const auctionAssetUpload = useFormFileUpload("AuctionAssetFile", form);
  const auctionRulesUpload = useFormFileUpload("AuctionRulesFile", form);
  const auctionPlanningUpload = useFormFileUpload("AuctionPlanningMap", form);

  const { user } = useSelector((state: any) => state.auth);
  const CreatedBy = user?.id || "defaultUser";

  console.log("auctionType: ", auctionType);

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

    console.log("Creating FormData with values:", formValues);

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
        formData.append(key, typeof value === "object" ? JSON.stringify(value) : value.toString());
        console.log(`Added field ${key}:`, value);
      }
    });

    // Append required files
    if (formValues.AuctionAssetFile) {
      formData.append("AuctionAssetFile", formValues.AuctionAssetFile);
      console.log("Added AuctionAssetFile:", formValues.AuctionAssetFile.name);
    } else {
      console.error("AuctionAssetFile is missing!");
    }

    if (formValues.AuctionRulesFile) {
      formData.append("AuctionRulesFile", formValues.AuctionRulesFile);
      console.log("Added AuctionRulesFile:", formValues.AuctionRulesFile.name);
    } else {
      console.error("AuctionRulesFile is missing!");
    }

    // Append optional file if it exists
    if (formValues.AuctionPlanningMap) {
      formData.append("AuctionPlanningMap", formValues.AuctionPlanningMap);
      console.log("Added AuctionPlanningMap:", formValues.AuctionPlanningMap.name);
    }

    // Log all FormData entries
    console.log("Final FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
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
      const [registerOpenDate, registerEndDate] = values.RegisterTimeRange || [];
      const [auctionStartDate, auctionEndDate] = values.AuctionTimeRange || [];
      if (!registerOpenDate || !registerEndDate || !auctionStartDate || !auctionEndDate) {
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

      console.log("Formatted values before creating FormData:", formattedValues);

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
    <Form
      form={form}
      className="space-y-6"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={() => {
        message.error("Vui lòng kiểm tra các trường bắt buộc!");
      }}
      onValuesChange={(changedValues) => {
        if (changedValues.RegisterTimeRange) {
          setRegisterRange(changedValues.RegisterTimeRange);
        }
      }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} lg={8}>
          <Card
            title="Thông Tin Đấu Giá"
            className="bg-blue-50 border border-teal-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Form.Item
              label="Tên đấu giá"
              name="AuctionName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên đấu giá!",
                },
              ]}
            >
              <Input
                className="w-full border-teal-200 bg-white rounded-lg p-2 focus:border-teal-300"
                placeholder="Nhập tên đấu giá"
              />
            </Form.Item>
            <Form.Item
              label="Danh mục tài sản"
              name="CategoryId"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn danh mục!",
                },
              ]}
            >
              <Select
                className="w-full border-teal-200 bg-white rounded-lg"
                placeholder="Chọn danh mục"
                options={dataAuctionCategoryList}
                onSelect={(val) => setIsRealEstate(val === REAL_ESTATE_CATEGORY_ID)}
              />
            </Form.Item>
            <Form.Item
              label="Số vòng tối đa"
              name="NumberRoundMax"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số vòng tối đa!",
                },
              ]}
            >
              <Input
                className="w-full border-teal-200 bg-white rounded-lg p-2 focus:border-teal-300"
                placeholder="Nhập số vòng tối đa"
                type="number"
                max={5}
                min={1}
              />
            </Form.Item>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card
            title="Thời Gian"
            className="bg-blue-50 border border-teal-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Form.Item
              label="Thời gian đăng ký"
              name="RegisterTimeRange"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn thời gian đăng ký!",
                },
              ]}
            >
              <RangePicker
                className="w-full border-teal-200 bg-white rounded-lg p-2 focus:border-teal-300"
                format="DD/MM/YYYY HH"
                showTime={{ format: 'HH' }}
                placeholder={["Ngày giờ mở đăng ký", "Ngày giờ kết thúc đăng ký"]}
                disabledDate={disabledRegisterDate}
              />
            </Form.Item>
            <Form.Item
              label="Thời gian đấu giá"
              name="AuctionTimeRange"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn thời gian đấu giá!",
                },
              ]}
            >
              <RangePicker
                className="w-full border-teal-200 bg-white rounded-lg p-2 focus:border-teal-300"
                format="DD/MM/YYYY HH"
                showTime={{ format: 'HH' }}
                placeholder={["Ngày giờ bắt đầu đấu giá", "Ngày giờ kết thúc đấu giá"]}
                disabledDate={disabledAuctionDate}
                disabled={!registerRange}
              />
            </Form.Item>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card
            title="Tệp Tài Liệu"
            className="bg-blue-50 border border-teal-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {" "}
            <Form.Item
              label={
                <span>
                  Tệp tài sản đấu giá
                  <Tooltip title="Chỉ nhận file đúng định dạng như file mẫu" placement="top">
                    <span className="ml-2 text-blue-500 cursor-pointer">
                      <QuestionCircleOutlined />
                    </span>
                  </Tooltip>
                </span>
              }
              name="AuctionAssetFile"
              rules={[
                {
                  required: true,
                  message: "Vui lòng tải lên tệp tài sản!",
                },
                {
                  validator: (_, value) => {
                    if (!value || value.length === 0) {
                      return Promise.reject(new Error("Vui lòng tải lên tệp tài sản!"));
                    }
                    const file = value[0];
                    if (!file.originFileObj && !file.name) {
                      return Promise.reject(new Error("File không hợp lệ!"));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <UploadFile contentName="AuctionAssetFile" onChange={auctionAssetUpload.onChange} />
              <div
                className="cursor-pointer mt-2 text-blue-400 underline"
                onClick={handleDownloadTemplate}
              >
                Tải mẫu danh sách tải sản
              </div>
            </Form.Item>{" "}
            <Form.Item
              label="Tệp quy tắc đấu giá"
              name="AuctionRulesFile"
              rules={[
                {
                  required: true,
                  message: "Vui lòng tải lên tệp quy tắc!",
                },
                {
                  validator: (_, value) => {
                    if (!value || value.length === 0) {
                      return Promise.reject(new Error("Vui lòng tải lên tệp quy tắc!"));
                    }
                    const file = value[0];
                    if (!file.originFileObj && !file.name) {
                      return Promise.reject(new Error("File không hợp lệ!"));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <UploadFile contentName="AuctionRulesFile" onChange={auctionRulesUpload.onChange} />
            </Form.Item>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="mt-6">
        <Col xs={24} lg={isRealEstate ? 12 : 24}>
          <Card
            title="Mô tả Đấu Giá"
            className="bg-blue-50 border border-teal-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Form.Item
              name="AuctionDescription"
              label="Người có tài sản"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mô tả!",
                },
              ]}
            >
              <Input.TextArea
                rows={2}
                className="w-full border-teal-200 bg-white rounded-lg p-2 focus:border-teal-300"
                placeholder="Nhập mô tả đấu giá"
              />
            </Form.Item>
          </Card>
        </Col>
        {isRealEstate && (
          <Col xs={24} lg={12}>
            <Card
              title="Bản Đồ Kế Hoạch"
              className="bg-blue-50 border border-teal-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <Form.Item
                label="Bản đồ kế hoạch đấu giá"
                name="AuctionPlanningMap"
                valuePropName="fileList"
                required={isRealEstate ? true : false}
              >
                <UploadFile
                  contentName="AuctionPlanningMap"
                  onChange={auctionPlanningUpload.onChange}
                />
              </Form.Item>
              <Form.Item
                label="Vị trí trên bản đồ"
                name="AuctionMap"
                required={isRealEstate ? true : false}
              >
                <Input
                  className="w-full border-teal-200 bg-white rounded-lg p-2 focus:border-teal-300"
                  placeholder="Nhập vị trí trên bản đồ"
                />
              </Form.Item>
            </Card>
          </Col>
        )}
      </Row>

      <Form.Item className="text-center mt-6">
        <Button
          htmlType="submit"
          type="primary"
          loading={loading}
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          Tạo Đấu Giá
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AuctionCreateForm;
