import { useEffect, useState, useCallback } from "react";
import CustomModal from "../../../components/Common/CustomModal";
import { useSelector } from "react-redux";
import { Button, Spin, Tooltip } from "antd";
import UserServices from "../../../services/UserServices";
import { InfoRow } from "../../../components/InfoRow";
import { convertToVietnamTime } from "../../../utils/timeConfig";
import { EditOutlined } from "@ant-design/icons";
import EditAccount from "./EditAccount/EditAccount";
import type { RootState } from "../../../store/store";
import type { ApiResponse } from "../../../types/responseAxios";

interface UserInfo {
  name?: string;
  roleName?: string;
  phoneNumber?: string;
  email?: string;
  gender?: boolean | string;
  birthDay?: string;
  recentLocation?: string;
  originLocation?: string;
  citizenIdentification?: string;
  issueDate?: string;
  validDate?: string;
  issueBy?: string;
  nationality?: string;
}

interface UserProfileProps {
  open: boolean;
  onCancel: () => void;
}

interface GetUserInfoParams {
  user_id: string;
}

const UserProfile = ({ open, onCancel }: UserProfileProps) => {
  const [loading, setLoading] = useState(false);
  const [editAccountOpen, setEditAccountOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const getUserInfo = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const params: GetUserInfoParams = { user_id: user.id };
      const res: ApiResponse<UserInfo> = await UserServices.getUserInfo(params);

      if (res.code === 200) {
        setUserInfo(res.data);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (open) {
      getUserInfo();
    }
  }, [open, editAccountOpen, getUserInfo]);

  return (
    <CustomModal
      title="Thông tin cá nhân"
      open={open}
      onCancel={onCancel}
      width={800}
      footer={null}
      style={{ top: 30 }}
    >
      <Spin spinning={loading} tip="Đang tải...">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2.5 shadow-[0_0_12px_2px_rgba(0,0,0,0.1)] rounded-xl p-5">
            <div className="absolute  top-4 right-5">
              <Button
                style={{
                  backgroundColor: "#D7ECFC",
                  borderColor: "#D7ECFC",
                }}
                className="text-white"
              >
                <Tooltip title="Chỉnh sửa thông tin liên lạc">
                  <EditOutlined onClick={() => setEditAccountOpen(true)} />
                </Tooltip>
              </Button>
            </div>
            <InfoRow label="Họ và tên" value={userInfo?.name} />
            <InfoRow label="Chức vụ" value={userInfo?.roleName as string} />
            <InfoRow label="Số điện thoại" value={userInfo?.phoneNumber} />
            <InfoRow label="Email" value={userInfo?.email} />
          </div>
          <div className="flex flex-col gap-2.5 shadow-[0_0_12px_2px_rgba(0,0,0,0.1)] rounded-xl p-5">
            <InfoRow label="Giới tính" value={userInfo?.gender === true ? "Nam" : "Nữ"} />
            <InfoRow label="Ngày sinh" value={convertToVietnamTime(userInfo?.birthDay)} />

            <InfoRow label="Địa chỉ" value={userInfo?.recentLocation} />
            <InfoRow label="Quê quán" value={userInfo?.originLocation} />
          </div>

          <div className="flex flex-col gap-2.5 shadow-[0_0_12px_2px_rgba(0,0,0,0.1)] rounded-xl p-5">
            <InfoRow label="Số CCCD" value={userInfo?.citizenIdentification} />
            <InfoRow label="Ngày cấp" value={convertToVietnamTime(userInfo?.issueDate)} />
            <InfoRow label="Ngày hết hạn" value={convertToVietnamTime(userInfo?.validDate)} />
            <InfoRow label="Nơi cấp" value={userInfo?.issueBy} />
            <InfoRow label="Quốc tịch" value={userInfo?.nationality} />
          </div>
        </div>
      </Spin>
      <EditAccount open={editAccountOpen} onCancel={() => setEditAccountOpen(false)} />
    </CustomModal>
  );
};

export default UserProfile;
