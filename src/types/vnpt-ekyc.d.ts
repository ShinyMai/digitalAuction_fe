// src/types/vnpt-ekyc.d.ts

export interface VnptEkycInitObject {
  BACKEND_URL: string;
  TOKEN_KEY: string;
  TOKEN_ID: string;
  AUTHORIZION: string;
  ENABLE_GGCAPCHAR: boolean;
  PARRENT_ID: string;
  FLOW_TYPE: "DOCUMENT" | "FACE";
  [key: string]: unknown;
}

export interface VnptEkycResult {
  type_document: number;
  // ... Thêm các thuộc tính khác bạn mong đợi từ kết quả
  [key: string]: unknown;
}

declare global {
  interface Window {
    FaceVNPTBrowserSDK: {
      init: () => Promise<void>;
    };
    ekycsdk: {
      init: (
        config: VnptEkycInitObject,
        callback: (res: VnptEkycResult) => void
      ) => void;
      viewResult: (
        typeDocument: number,
        result: unknown
      ) => void;
    };
    call_after_end_flow: (data: unknown) => void;
  }
}
