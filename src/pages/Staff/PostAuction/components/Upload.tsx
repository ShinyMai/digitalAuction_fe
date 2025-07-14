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

const CustomUploadFile = ({
  contentName,
  value = [],
  onChange,
}: Props) => {
  const [fileList, setFileList] = useState<AntUploadFile[]>(value);

  // Hàm cắt ngắn tên file nếu quá dài
  const truncateFileName = (name: string, maxLength: number = 20) => {
    if (name.length > maxLength) {
      return name.slice(0, maxLength - 3) + "...";
    }
    return name;
  };

  const props: UploadProps = {
    name: "file",
    accept: ".xlsx,.xls,.docx",
    fileList: fileList.map((file) => ({
      ...file,
      name: truncateFileName(file.name),
    })),
    beforeUpload: (file) => {
      const isValidFile =
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (!isValidFile) {
        message.error(
          "Chỉ được tải lên file Excel (.xlsx, .xls) hoặc Word (.docx)!"
        );
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange: (info) => {
      let newFileList = [...info.fileList];
      newFileList = newFileList.slice(-1);
      newFileList = newFileList.map((file) => {
        if (!file.status) {
          return { ...file, status: "done" };
        }
        return file;
      });
      setFileList(newFileList);
      onChange?.(newFileList);
      console.log("FileList:", newFileList);
    },
    customRequest: ({ file, onSuccess }) => {
      setTimeout(() => {
        onSuccess?.(null, file);
      }, 0);
    },
    // Tùy chỉnh cách hiển thị tên file
    itemRender: (originNode, file) => {
      return (
        <Tooltip title={file.name}>
          {originNode}
        </Tooltip>
      );
    },
  };

  return (
    <Upload {...props}>
      <Button
        icon={<UploadOutlined />}
        style={{ width: 250, height: 40 }}
        className="rounded-lg"
      >
        {contentName}
      </Button>
    </Upload>
  );
};

export default CustomUploadFile;