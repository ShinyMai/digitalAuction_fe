import { useState } from "react";
import type { UploadFile as AntUploadFile } from "antd/es/upload/interface";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFormFileUpload = (fieldName: string, form: any) => {
  const [fileList, setFileList] = useState<AntUploadFile[]>([]);

  const handleChange = (newFileList: AntUploadFile[]) => {
    setFileList(newFileList);
    // Update form field value
    form.setFieldValue(fieldName, newFileList);
  };

  const resetFiles = () => {
    setFileList([]);
    form.setFieldValue(fieldName, []);
  };

  return {
    fileList,
    onChange: handleChange,
    resetFiles,
  };
};
