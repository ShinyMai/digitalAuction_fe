import { useState, useEffect } from "react";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Button, message, Upload, Tooltip, List } from "antd";
import type { UploadFile as AntUploadFile } from "antd/es/upload/interface";

interface Props {
    contentName: string;
    value?: AntUploadFile[];
    onChange?: (value: AntUploadFile[]) => void;
    accept?: string;
    maxCount?: number;
}

const CustomUploadMultipleFile = ({
    contentName,
    value,
    onChange,
    accept = ".pdf",
    maxCount = 10
}: Props) => {
    const [fileList, setFileList] = useState<AntUploadFile[]>(value || []);

    // Đồng bộ với value từ Form
    useEffect(() => {
        if (value !== undefined) {
            setFileList(value);
        }
    }, [value]);

    // Hàm cắt ngắn tên file nếu quá dài
    const truncateFileName = (name: string, maxLength: number = 30) => {
        if (name.length > maxLength) {
            return name.slice(0, maxLength - 3) + "...";
        }
        return name;
    };

    const props: UploadProps = {
        name: "file",
        accept: accept,
        fileList: fileList,
        multiple: true,
        beforeUpload: (file) => {
            // Tạo map để kiểm tra file type
            const fileTypeMap: { [key: string]: string } = {
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

            // Kiểm tra số lượng file tối đa
            if (fileList.length >= maxCount) {
                message.error(`Chỉ được tải lên tối đa ${maxCount} file!`);
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
        onRemove: (file) => {
            const newFileList = fileList.filter(item => item.uid !== file.uid);
            setFileList(newFileList);
            onChange?.(newFileList);
        },
        showUploadList: false, // Tắt upload list mặc định để tự custom
    };

    const handleRemoveFile = (fileUid: string) => {
        const newFileList = fileList.filter(item => item.uid !== fileUid);
        setFileList(newFileList);
        onChange?.(newFileList);
    };

    return (
        <div>
            <Upload {...props}>
                <Button
                    icon={<UploadOutlined />}
                    style={{ width: 250, height: 40 }}
                    className="rounded-lg"
                    disabled={fileList.length >= maxCount}
                >
                    {contentName}
                </Button>
            </Upload>

            {fileList.length > 0 && (
                <div className="mt-3">
                    <div className="text-sm text-gray-600 mb-2">
                        Đã tải lên {fileList.length}/{maxCount} file(s):
                    </div>
                    <List
                        size="small"
                        dataSource={fileList}
                        renderItem={(file) => (
                            <List.Item
                                className="px-3 py-2 bg-gray-50 rounded-lg mb-2"
                                actions={[
                                    <Button
                                        key="delete"
                                        type="text"
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleRemoveFile(file.uid)}
                                        className="text-red-500 hover:text-red-700"
                                    />
                                ]}
                            >
                                <div className="flex items-center">
                                    <span className="text-green-600 mr-2">📄</span>
                                    <Tooltip title={file.name}>
                                        <span className="text-sm">
                                            {truncateFileName(file.name || "Unnamed file")}
                                        </span>
                                    </Tooltip>
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
            )}

            {fileList.length === 0 && (
                <div className="mt-2 text-sm text-gray-500">
                    Chưa có file nào được tải lên
                </div>
            )}
        </div>
    );
};

export default CustomUploadMultipleFile;
