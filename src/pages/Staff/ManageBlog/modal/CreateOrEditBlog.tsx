import { useState, useEffect } from "react";
import { Form, Input, Upload, Button, message } from "antd";
import {
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  FileTextOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { useForm } from "antd/es/form/Form";
import CustomModal from "../../../../components/Common/CustomModal";
import NewsServices from "../../../../services/NewsService";
import { toast } from "react-toastify";
import type { BlogData } from "../types";

const { TextArea } = Input;

interface CreateOrEditBlogProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  blogData?: BlogData; // Optional blog data for editing
}

interface BlogFormValues {
  title: string;
  content: string;
  thumbnail?: UploadFile[];
}

const CreateOrEditBlog = ({ open, onCancel, onSuccess, blogData }: CreateOrEditBlogProps) => {
  const [form] = useForm<BlogFormValues>();
  const [loading, setLoading] = useState(false);
  const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]);

  const isEditMode = !!blogData;

  // Populate form when editing
  useEffect(() => {
    if (open && blogData) {
      form.setFieldsValue({
        title: blogData.title,
        content: blogData.content,
      });

      // Set existing thumbnail if available
      if (blogData.thumbnailUrl) {
        const existingThumbnail: UploadFile = {
          uid: "-1",
          name: "existing-thumbnail",
          status: "done",
          url: blogData.thumbnailUrl,
        };
        setThumbnailList([existingThumbnail]);
        form.setFieldValue("thumbnail", [existingThumbnail]);
      }
    } else if (open && !blogData) {
      // Reset form for create mode
      form.resetFields();
      setThumbnailList([]);
    }
  }, [open, blogData, form]);

  const handleCancel = () => {
    form.resetFields();
    setThumbnailList([]);
    onCancel();
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được tải lên file hình ảnh!");
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Hình ảnh phải nhỏ hơn 5MB!");
      return false;
    }

    return false; // Prevent auto upload
  };

  const handleThumbnailChange: UploadProps["onChange"] = ({ fileList }) => {
    const newFileList = fileList.slice(-1); // Only keep the last file
    setThumbnailList(newFileList);
    form.setFieldValue("thumbnail", newFileList);
  };
  const onFinish = async (values: BlogFormValues) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("Title", values.title);
      formData.append("Content", values.content);

      // Add thumbnail file if exists and is new (has originFileObj)
      if (thumbnailList.length > 0 && thumbnailList[0].originFileObj) {
        formData.append("Thumbnail", thumbnailList[0].originFileObj);
      }

      let res;
      if (isEditMode && blogData) {
        formData.append("BlogId", blogData.blogId);
        res = await NewsServices.updateBlog(formData);

        if (res.code === 200) {
          toast.success("Cập nhật bài viết thành công!");
        } else {
          toast.error(res.message || "Cập nhật bài viết thất bại!");
        }
      } else {
        // Create mode
        res = await NewsServices.createBlog(formData);

        if (res.code === 200) {
          toast.success("Tạo bài viết thành công!");
        } else {
          toast.error(res.message || "Tạo bài viết thất bại!");
        }
      }

      if (res.code === 200) {
        handleCancel();
        onSuccess?.();
      }
    } catch (error: unknown) {
      console.error("Error saving blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div className="flex flex-col items-center justify-center py-6">
      <PlusOutlined className="text-2xl text-gray-400 mb-2" />
      <div className="text-sm text-gray-500">Tải lên hình ảnh</div>
      <div className="text-xs text-gray-400 mt-1">PNG, JPG, GIF tối đa 5MB</div>
    </div>
  );

  return (
    <CustomModal
      title={
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">
            {isEditMode ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
          </span>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      width={800}
      footer={null}
      className="create-blog-modal"
      style={{ top: 20 }}
    >
      <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-lg">
        <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-6">
          {/* Title Field */}
          <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <FileTextOutlined className="text-white text-xs" />
              </div>
              Thông tin bài viết
            </h3>

            <Form.Item
              name="title"
              label={<span className="font-semibold text-gray-700">Tiêu đề bài viết</span>}
              rules={[
                { required: true, message: "Vui lòng nhập tiêu đề bài viết!" },
                { min: 10, message: "Tiêu đề phải có ít nhất 10 ký tự!" },
                { max: 200, message: "Tiêu đề không được vượt quá 200 ký tự!" },
              ]}
            >
              <Input
                placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                className="h-12 rounded-xl border-2 hover:border-blue-400 focus:border-blue-500"
                maxLength={200}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="content"
              label={<span className="font-semibold text-gray-700">Nội dung bài viết</span>}
              rules={[
                { required: true, message: "Vui lòng nhập nội dung bài viết!" },
                { min: 50, message: "Nội dung phải có ít nhất 50 ký tự!" },
                { max: 5000, message: "Nội dung không được vượt quá 5000 ký tự!" },
              ]}
            >
              <TextArea
                placeholder="Viết nội dung chi tiết cho bài viết của bạn..."
                rows={10}
                className="rounded-xl border-2 hover:border-blue-400 focus:border-blue-500"
                maxLength={5000}
                showCount
              />
            </Form.Item>
          </div>

          {/* Thumbnail Upload Field */}
          <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <PictureOutlined className="text-white text-xs" />
              </div>
              Hình ảnh đại diện
            </h3>
            <Form.Item
              name="thumbnail"
              label={<span className="font-semibold text-gray-700">Thumbnail</span>}
              rules={[
                {
                  required: !isEditMode,
                  message: "Vui lòng tải lên hình ảnh đại diện!",
                },
              ]}
            >
              <Upload
                listType="picture-card"
                fileList={thumbnailList}
                beforeUpload={beforeUpload}
                onChange={handleThumbnailChange}
                maxCount={1}
                className="thumbnail-upload"
              >
                {thumbnailList.length < 1 && uploadButton}
              </Upload>
            </Form.Item>
            <div className="mt-2 text-sm text-gray-500">
              {isEditMode && <p>• Để trống nếu không muốn thay đổi hình ảnh hiện tại</p>}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              size="large"
              onClick={handleCancel}
              className="px-8 py-2 h-12 rounded-xl border-2 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
              icon={<CloseOutlined />}
            >
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
              className="px-8 py-2 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 border-0 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium hover:scale-105"
              icon={<SaveOutlined />}
            >
              {loading
                ? isEditMode
                  ? "Đang cập nhật..."
                  : "Đang tạo..."
                : isEditMode
                ? "Cập nhật bài viết"
                : "Tạo bài viết"}
            </Button>
          </div>
        </Form>
      </div>

      <style>{`
        .create-blog-modal .ant-modal-content {
          border-radius: 20px !important;
          overflow: hidden !important;
        }
        
        .create-blog-modal .ant-form-item-label > label {
          font-weight: 600 !important;
          color: #374151 !important;
        }
        
        .create-blog-modal .ant-input:focus,
        .create-blog-modal .ant-input-focused,
        .create-blog-modal .ant-input:hover {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        
        .create-blog-modal .ant-upload-select-picture-card {
          width: 200px !important;
          height: 160px !important;
          border: 2px dashed #d1d5db !important;
          border-radius: 12px !important;
          background: #f9fafb !important;
          transition: all 0.3s ease !important;
        }
        
        .create-blog-modal .ant-upload-select-picture-card:hover {
          border-color: #3b82f6 !important;
          background: #eff6ff !important;
        }
        
        .create-blog-modal .ant-upload-list-picture-card .ant-upload-list-item {
          border-radius: 12px !important;
          overflow: hidden !important;
        }
        
        .create-blog-modal .ant-btn:hover {
          transform: translateY(-1px) !important;
        }
      `}</style>
    </CustomModal>
  );
};

export default CreateOrEditBlog;
