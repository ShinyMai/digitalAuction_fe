// src/components/EkycSDK.tsx
import { useEffect, useState } from "react";
import { loadEkycScripts } from "./loadEkycScripts";

declare global {
  interface Window {
    SDK: {
      launch: (config: unknown) => void;
    };
  }
}

const EkycSDK = () => {
  const tokenKey = import.meta.env.VITE_EKYC_TOKEN_KEY;
  const tokenId = import.meta.env.VITE_EKYC_TOKEN_ID;
  const accessToken = import.meta.env
    .VITE_EKYC_ACCESS_TOKEN;
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    loadEkycScripts()
      .then(() => {
        if (isMounted) {
          setIsSdkLoaded(true);
        }
      })
      .catch((error) => {
        console.error("Lỗi tải script eKYC:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isSdkLoaded || !window.SDK) {
      return;
    }

    const getResult = (result: object) => {
      console.log("Kết quả eKYC:", result);
    };

    const dataConfig = {
      BACKEND_URL: "https://api.idg.vnpt.vn",
      TOKEN_KEY: tokenKey,
      TOKEN_ID: tokenId,
      ACCESS_TOKEN: accessToken,
      HAS_RESULT_SCREEN: true,
      FLOW_TAKEN: "DOCUMENT_TO_FACE",
      LIST_TYPE_DOCUMENT: [-1, 5, 6, 7, 4],
      DOCUMENT_TYPE_START: 999,
      CHECK_LIVENESS_CARD: true,
      CHECK_LIVENESS_FACE: true,
      CHECK_MASKED_FACE: true,
      COMPARE_FACE: true,
      CUSTOM_THEME: {
        PRIMARY_COLOR: "#0084D1",
        TEXT_COLOR_DEFAULT: "#ffffff",
        BACKGROUND_COLOR: "#0F2B3B",
      },
      CHALLENGE_CODE: "9999999",
      SHOW_STEP: true,
      HAS_QR_SCAN: true,
      DEFAULT_LANGUAGE: "vi",
      CALL_BACK: getResult,
    };

    if (window.SDK && window.SDK.launch) {
      window.SDK.launch(dataConfig);
      console.log(dataConfig)
    } else {
      console.error(
        "SDK không được tải hoặc không có phương thức launch."
      );
    }
  }, [isSdkLoaded]);

  return <div id="ekyc_sdk_intergrated" />;
};

export default EkycSDK;
