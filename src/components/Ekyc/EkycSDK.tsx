// src/components/EkycSDK.tsx
import { useEffect, useState } from "react";
import { loadEkycScripts } from "./loadEkycScripts";

declare global {
  interface Window {
    SDK: {
      launch: (config: any) => void;
    };
  }
}

const EkycSDK = () => {
  const tokenKey = import.meta.env.VITE_EKYC_TOKEN_KEY;
  const tokenId = import.meta.env.VITE_EKYC_TOKEN_ID;
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

    const getResult = (result: any) => {
      console.log("Kết quả eKYC:", result);
    };

    const dataConfig = {
      BACKEND_URL: "https://api.idg.vnpt.vn",
      TOKEN_KEY: tokenKey,
      TOKEN_ID: tokenId,
      ACCESS_TOKEN:
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFuc2FjdGlvbl9pZCI6IjE2ZWMxMDUxLWRjMTktNDhmNS1iYTFhLWE0OGE0ZGM3MWIzMyIsInN1YiI6IjZkYzY1M2Y4LTQyYTAtMTFmMC1iMjI3LTM1ZTNjMmI1ZDQzNyIsImF1ZCI6WyJyZXN0c2VydmljZSJdLCJ1c2VyX25hbWUiOiJxdWFuZ3BuaGUxNjAyNjBAZnB0LmVkdS52biIsInNjb3BlIjpbInJlYWQiXSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3QiLCJuYW1lIjoicXVhbmdwbmhlMTYwMjYwQGZwdC5lZHUudm4iLCJleHAiOjE3NDk2MjI3OTIsInV1aWRfYWNjb3VudCI6IjZkYzY1M2Y4LTQyYTAtMTFmMC1iMjI3LTM1ZTNjMmI1ZDQzNyIsImF1dGhvcml0aWVzIjpbIlVTRVIiXSwianRpIjoiMGU4M2FmYTctMTU4Ny00ODFmLWIxYzUtMWU2ODE5NmFkZWNjIiwiY2xpZW50X2lkIjoiY2xpZW50YXBwIn0.m1Zs62F-hoAnY2csUxScXRFwSa1H-Lo-UhdDHPS9eluFtGN4d5iI2CkGogD-Y0ZT46vLvXniHTZE4nOSUQtvi4BYFI9D8IRopc1MTxzJd-_0uCcNAmHt3MwfwVZL8nPG77AxfgxRA0eHOPtqmyU1JZeiz-HCeedrtDh125RGICt6KDcrjoHNFZ-wBbx719UITWJ87W16HWS_udoVQA0yWmNyqnGsLOy_d11beE8ter35ErQ0y2n8DK0EH5a8LjJbh81S31djPnwm_BZhuG0ZiAUKRpLyIX2KeW_kbD4yAweXn0TFtT9e9lnpnwZ5uNRjkZPIidLoFIQLZ_2CIPmXUg",
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
      CHALLENGE_CODE: "",
      SHOW_STEP: true,
      HAS_QR_SCAN: true,
      DEFAULT_LANGUAGE: "vi",
      CALL_BACK: getResult,
    };

    window.SDK.launch(dataConfig);
  }, [isSdkLoaded]);

  return <div id="ekyc_sdk_intergrated" className="bg-white p-4 rounded-lg" />;
};

export default EkycSDK;