import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import type { UploadFile as AntUploadFile } from 'antd/es/upload/interface';

interface Props {
    contentName: string;
    value?: AntUploadFile[];
    onChange?: (value: AntUploadFile[]) => void;
}

const CustomUploadFile = ({ contentName, value = [], onChange }: Props) => {
    const [fileList, setFileList] = useState<AntUploadFile[]>(value);

    const props: UploadProps = {
        name: 'file',
        accept: '.xlsx,.xls',
        fileList,
        beforeUpload: (file) => {
            const isExcel =
                file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'application/vnd.ms-excel';
            if (!isExcel) {
                message.error('Chỉ được tải lên file Excel (.xlsx, .xls)!');
                return Upload.LIST_IGNORE;
            }
            return false;
        },
        onChange: (info) => {
            let newFileList = [...info.fileList];
            newFileList = newFileList.slice(-1);
            newFileList = newFileList.map((file) => {
                if (!file.status) {
                    return { ...file, status: 'done' };
                }
                return file;
            });
            setFileList(newFileList);
            onChange?.(newFileList);
            console.log('FileList:', newFileList);
        },
        customRequest: ({ file, onSuccess }) => {
            setTimeout(() => {
                onSuccess?.(null, file);
            }, 0);
        },
    };

    return (
        <Upload {...props}>
            <Button icon={<UploadOutlined />} style={{ width: 250, height: 40 }} className="rounded-lg">
                {contentName}
            </Button>
        </Upload>
    );
};

export default CustomUploadFile;