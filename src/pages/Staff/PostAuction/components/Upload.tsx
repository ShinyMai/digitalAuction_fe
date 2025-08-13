import { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload, Tooltip } from "antd";
import type { UploadFile as AntUploadFile } from "antd/es/upload/interface";

interface Props {
  contentName: string;
  value?: AntUploadFile[];
  onChange?: (value: AntUploadFile[]) => void;
  accept?: string; // Thêm prop accept để tùy chỉnh định dạng file
}

const CustomUploadFile = ({ contentName, value, onChange, accept = ".xlsx,.xls,.docx,.pdf" }: Props) => {
  const [fileList, setFileList] = useState<AntUploadFile[]>(value || []);

  // Đồng bộ với value từ Form
  useEffect(() => {
    if (value !== undefined) {
      setFileList(value);
    }
  }, [value]);

  // Hàm cắt ngắn tên file nếu quá dài
  const truncateFileName = (name: string, maxLength: number = 20) => {
    if (name.length > maxLength) {
      return name.slice(0, maxLength - 3) + "...";
    }
    return name;
  };

  const props: UploadProps = {
    name: "file",
    accept: accept,
    fileList: fileList,
    beforeUpload: (file) => {
      // Tạo map để kiểm tra file type
      const fileTypeMap: { [key: string]: string } = {
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.xlsm': 'application/vnd.ms-excel.sheet.macroEnabled.12',
        '.xls': 'application/vnd.ms-excel',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.pdf': 'application/pdf'
      };

      // Lấy danh sách extension được phép từ accept prop
      const allowedExtensions = accept.split(',').map(ext => ext.trim());
      const allowedTypes = allowedExtensions.map(ext => fileTypeMap[ext]).filter(Boolean);

      // Kiểm tra file extension
      const fileName = file.name.toLowerCase();
      const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
      const isValidExtension = allowedExtensions.includes(fileExtension);

      // Kiểm tra file type
      const isValidType = allowedTypes.includes(file.type);

      if (!isValidExtension && !isValidType) {
        const extensionList = allowedExtensions.join(', ');
        message.error(`Chỉ được tải lên file có định dạng: ${extensionList}!`);
        return Upload.LIST_IGNORE;
      }

      const isLt10M = file.size < 10 * 1024 * 1024;
      if (!isLt10M) {
        message.error("File phải nhỏ hơn 10MB!");
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange: (info) => {
      let newFileList = [...info.fileList];

      // Chỉ giữ file cuối cùng
      newFileList = newFileList.slice(-1);

      // Đảm bảo file có status
      newFileList = newFileList.map((file) => ({
        ...file,
        status: file.status || "done",
      }));

      setFileList(newFileList);
      onChange?.(newFileList);
    },
    customRequest: ({ onSuccess, onError }) => {
      // Simulate upload success
      setTimeout(() => {
        try {
          onSuccess?.("Upload completed");
        } catch (error) {
          console.error("Upload error:", error);
          onError?.(error as Error);
        }
      }, 100);
    },
    onRemove: () => {
      setFileList([]);
      onChange?.([]);
    },
    // Tùy chỉnh cách hiển thị tên file
    itemRender: (originNode, file) => {
      return <Tooltip title={file.name}>{originNode}</Tooltip>;
    },
  };
  return (
    <div>
      <Upload {...props}>
        <Button
          icon={<UploadOutlined />}
          style={{ width: 250, height: 40 }}
          className="rounded-lg"
        >
          {contentName}
        </Button>
      </Upload>{" "}
      {fileList.length > 0 && (
        <div className="mt-2 text-sm text-green-600">
          ✓ Đã tải: {truncateFileName(fileList[0].name || "Unnamed file")}
        </div>
      )}
    </div>
  );
};

export default CustomUploadFile;
