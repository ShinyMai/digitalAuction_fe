// src/components/EkycSDK.tsx
import React, { useEffect, useState } from "react";
import { loadEkycScripts } from "./loadEkycScripts";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

declare global {
  interface Window {
    SDK: {
      launch: (config: unknown) => void;
    };
  }
}

interface EkycSDKProps {
  setCurrent: (current: number) => void;
  setAccount: (account: object) => void;
}

interface EkycResult {
  ocr: {
    object: {
      id?: string;
      name?: string;
      birth_day?: string;
      nationality?: string;
      gender?: string;
      valid_date?: string;
      origin_location?: string;
      recent_location?: string;
      issue_date?: string;
      issue_place?: string;
    };
  };
  compare: {
    object: {
      msg: string;
    };
  };
  liveness_face: {
    object: {
      liveness: string;
    };
  };
  liveness_card_front: {
    object: {
      liveness: string;
    };
  };
  liveness_card_back: {
    object: {
      liveness: string;
    };
  };
}

const EkycSDK: React.FC<EkycSDKProps> = ({
  setCurrent,
  setAccount,
}) => {
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

    const CALL_BACK_END_FLOW = async (
      result: EkycResult
    ) => {
      if (!result?.ocr) {
        toast.error(
          "Không thể nhận diện thông tin từ giấy tờ."
        );
        return;
      }

      setAccount({
        citizenIdentification: result.ocr.object.id || "",
        name: result.ocr.object.name || "",
        birthDay: result.ocr.object.birth_day
          ? dayjs(result.ocr.object.birth_day, "DD/MM/YYYY")
          : null,
        issueDate: result.ocr.object.issue_date
          ? dayjs(
            result.ocr.object.issue_date,
            "DD/MM/YYYY"
          )
          : null,
        validDate: result.ocr.object.valid_date
          ? dayjs(
            result.ocr.object.valid_date,
            "DD/MM/YYYY"
          )
          : null,
        nationality: result.ocr.object.nationality || "",
        gender:
          result.ocr.object.gender === "Nam" ? true : false,
        originLocation:
          result.ocr.object.origin_location || "",
        recentLocation:
          result.ocr.object.recent_location || "",
        issueBy: result.ocr.object.issue_place || "",
      });

      if (result.compare?.object.msg === "NOMATCH") {
        toast.error(
          "Khuôn mặt không khớp với giấy tờ, vui lòng thử lại."
        );
        return;
      }

      if (
        result.liveness_face?.object.liveness === "failure"
      ) {
        toast.error(
          "Khuôn mặt không phải người thật, vui lòng thử lại."
        );
        return;
      }

      if (
        result.liveness_card_front?.object.liveness ===
        "failure"
      ) {
        toast.error(
          "Giấy tờ mặt trước không hợp lệ, vui lòng thử lại."
        );
        return;
      }

      if (
        result.liveness_card_back?.object.liveness ===
        "failure"
      ) {
        toast.error(
          "Giấy tờ mặt sau không hợp lệ, vui lòng thử lại."
        );
        return;
      }

      // Nếu qua hết các bước kiểm tra
      setCurrent(1);
      toast.success(
        "Xác thực thành công, sang bước tiếp theo."
      );
      console.log("result ==>", result);
    };

    const dataConfig = {
      BACKEND_URL: "https://api.idg.vnpt.vn",
      TOKEN_KEY: tokenKey,
      TOKEN_ID: tokenId,
      ACCESS_TOKEN: accessToken,
      HAS_RESULT_SCREEN: true,
      SDK_FLOW: "DOCUMENT_TO_FACE",
      LIST_TYPE_DOCUMENT: [-1],
      DOCUMENT_TYPE_START: 999,
      ENABLE_API_LIVENESS_DOCUMENT: true,
      ENABLE_API_LIVENESS_FACE: true,
      ENABLE_API_MASKED_FACE: true,
      ENABLE_API_COMPARE_FACE: true,
      CUSTOM_THEME: {
        PRIMARY_COLOR: "#0084D1",
        TEXT_COLOR_DEFAULT: "#ffffff",
        BACKGROUND_COLOR: "#0F2B3B",
      },
      CHALLENGE_CODE: "9999999",
      SHOW_STEP: true,
      HAS_QR_SCAN: true,
      DEFAULT_LANGUAGE: "vi",
      CALL_BACK_END_FLOW,
    };

    if (window.SDK && window.SDK.launch) {
      window.SDK.launch(dataConfig);
    } else {
      console.error(
        "SDK không được tải hoặc không có phương thức launch."
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSdkLoaded]);

  return (
    <div
      id="ekyc_sdk_intergrated"
      className="sm:rounded-lg lg:mx-8 sm:mt-4"
    />
  );
};

export default EkycSDK;
