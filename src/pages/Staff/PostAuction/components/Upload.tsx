import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload, Tooltip } from "antd";
import type { UploadFile as AntUploadFile } from "antd/es/upload/interface";

interface Props {
  contentName: string;
  value?: AntUploadFile[];
  onChange?: (value: AntUploadFile[]) => void;
}

const CustomUploadFile = ({ contentName, onChange }: Omit<Props, "value">) => {
  const [fileList, setFileList] = useState<AntUploadFile[]>([]);

  // Hàm cắt ngắn tên file nếu quá dài
  const truncateFileName = (name: string, maxLength: number = 20) => {
    if (name.length > maxLength) {
      return name.slice(0, maxLength - 3) + "...";
    }
    return name;
  };

  const props: UploadProps = {
    name: "file",
    accept: ".xlsx,.xls,.docx,.pdf",
    fileList: fileList,
    beforeUpload: (file) => {
      const isValidFile =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/pdf";

      if (!isValidFile) {
        message.error(
          "Chỉ được tải lên file Excel (.xlsx, .xls), Word (.docx) hoặc PDF!"
        );
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
