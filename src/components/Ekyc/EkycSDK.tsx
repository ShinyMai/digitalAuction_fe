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
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFuc2FjdGlvbl9pZCI6IjhkOTRmNDk1LWEzNGMtNDVhNC05NGQwLWNiN2U4YjE1N2E4ZSIsInN1YiI6Ijc5MDQ2MTBiLTM2MGQtMTFmMC1iOTdjLTBiNTc1N2Y2ZTdkOCIsImF1ZCI6WyJyZXN0c2VydmljZSJdLCJ1c2VyX25hbWUiOiJ0aGljaHNhbzExQGdtYWlsLmNvbSIsInNjb3BlIjpbInJlYWQiXSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3QiLCJuYW1lIjoidGhpY2hzYW8xMUBnbWFpbC5jb20iLCJleHAiOjE3NDk2NjUzNTYsInV1aWRfYWNjb3VudCI6Ijc5MDQ2MTBiLTM2MGQtMTFmMC1iOTdjLTBiNTc1N2Y2ZTdkOCIsImF1dGhvcml0aWVzIjpbIlVTRVIiXSwianRpIjoiMDI0Y2QxZGUtY2JiNi00MzFhLTllNTUtOTBkYzM4ZjgyYWFiIiwiY2xpZW50X2lkIjoiY2xpZW50YXBwIn0.Y7GqlD-B20DsZQXaAFvf4B8YftLKDGd-fDUd23lS9mC14j3btPtFmVCpJMfMei5GbFCBJjU5FFc4aMgSv3AbzWyYCShu8a9wmrDzn-61oiuhanVagKZjezOt1GD9dZwQuAowtfN2AvNyv8IfNTVlSZPvfPbt06E4gXj23kk1q_DP2YDInKLMz6sug1y-FtGxwVlKdolDuCvhbZUk7wsqQJsmgaKQ8ZIZkoE3A-BEGpYi1oT0y_Lx-UJLVn0iGn9fRW-oP2C9zfXLpvEQ0DmGuLv1RHy42bfy40oYjnOXYn7vSinrkE_lqGUa4xglUpuzUxsMHoSk6N94HkZdokkEaw",
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