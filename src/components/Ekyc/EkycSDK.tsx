// src/components/EkycSDK.tsx
import React, {useEffect, useState} from "react";
import {loadEkycScripts} from "./loadEkycScripts";
import {toast} from "react-toastify";
import dayjs from "dayjs";

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
    compare: {
        msg: string;
    };
    liveness_face: {
        liveness: string;
    };
    liveness_card_front: {
        liveness: string;
    };
    liveness_card_back: {
        liveness: string;
    };
}


const EkycSDK: React.FC<EkycSDKProps> = ({setCurrent, setAccount}) => {
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

        const CALL_BACK_END_FLOW = async (result: EkycResult) => {
            if (!result?.ocr) {
                toast.error("Không thể nhận diện thông tin từ giấy tờ.");
                return;
            }

            setAccount({
                citizenIdentification: result.ocr.id || "",
                name: result.ocr.name || "",
                birthDay: result.ocr.birth_day ? dayjs(result.ocr.birth_day) : null,
                issueDate: result.ocr.issue_date ? dayjs(result.ocr.issue_date) : null,
                validDate: result.ocr.valid_date ? dayjs(result.ocr.valid_date) : null,
                nationality: result.ocr.nationality || "",
                gender: result.ocr.gender || "",
                originLocation: result.ocr.origin_location || "",
                recentLocation: result.ocr.recent_location || "",
                issueBy: result.ocr.issue_place || "",
            });

            // Xử lý các lỗi xác thực
            if (result.compare?.msg === "NOMATCH") {
                toast.error("Khuôn mặt không khớp với giấy tờ, vui lòng thử lại.");
                return;
            }

            if (result.liveness_face?.liveness === "failure") {
                toast.error("Khuôn mặt không phải người thật, vui lòng thử lại.");
                return;
            }

            if (result.liveness_card_front?.liveness === "failure") {
                toast.error("Giấy tờ mặt trước không hợp lệ, vui lòng thử lại.");
                return;
            }

            if (result.liveness_card_back?.liveness === "failure") {
                toast.error("Giấy tờ mặt sau không hợp lệ, vui lòng thử lại.");
                return;
            }

            // Nếu qua hết các bước kiểm tra
            setCurrent(1);
            toast.success("Xác thực thành công, sang bước tiếp theo.");
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
                TEXT_COLOR_DEFAULT: "#000000",
                BACKGROUND_COLOR: "#ffffff",
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

    return <div id="ekyc_sdk_intergrated"/>;
};

export default EkycSDK;
