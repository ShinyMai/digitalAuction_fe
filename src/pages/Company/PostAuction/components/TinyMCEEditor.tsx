import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinyMCEEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  initialValue?: string;
  apiKey?: string;
  height?: number;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  value,
  onChange,
  initialValue = "<p></p>",
  apiKey = "7ykxq88baf5mse27hk2euqeg32tfzab7gger66mshxjxtd62",
  height = 500,
}) => {
  const editorRef = useRef<any>(null);

  // Cập nhật giá trị khi nội dung thay đổi
  const handleEditorChange = (
    content: string,
    editor: any
  ) => {
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <Editor
      apiKey={apiKey}
      onInit={(evt, editor) => (editorRef.current = editor)}
      onEditorChange={handleEditorChange}
      init={{
        height,
        menubar: true,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount",
        ],
        toolbar:
          "undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
    />
  );
};

export default TinyMCEEditor;
