/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import CustomModal from "../../components/Common/CustomModal";
import { useSelector } from "react-redux";
import { Button, Spin, Tooltip } from "antd";
import UserServices from "../../services/UserServices";
import { InfoRow } from "../../components/InfoRow";
import { convertToVietnamTime } from "../../utils/timeConfig";
import { EditOutlined } from "@ant-design/icons";

interface UserProfileProps {
  open: boolean;
  onCancel: () => void;
}

const UserProfile = ({
  open,
  onCancel,
}: UserProfileProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const [userInfo, setUserInfo] = useState<any>();

  const getUserInfo = async () => {
    setLoading(true);
    try {
      const res = await UserServices.getUserInfo({
        user_id: user.id,
      });

      if (res.code === 200) {
        setUserInfo(res.data);
      }
    } catch (error) {
      console.error(
        "Lỗi khi lấy thông tin người dùng:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      getUserInfo();
    }
  }, [open]);

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
                  <EditOutlined />
                </Tooltip>
              </Button>
            </div>
            <InfoRow
              label="Họ và tên"
              value={userInfo?.name}
            />
            <InfoRow
              label="Chức vụ"
              value={userInfo?.roleName as string}
            />
            <InfoRow
              label="Số điện thoại"
              value={userInfo?.phoneNumber}
            />
            <InfoRow
              label="Email"
              value={userInfo?.email}
            />
          </div>
          <div className="flex flex-col gap-2.5 shadow-[0_0_12px_2px_rgba(0,0,0,0.1)] rounded-xl p-5">
            <InfoRow
              label="Giới tính"
              value={
                userInfo?.gender === true ? "Nam" : "Nữ"
              }
            />
            <InfoRow
              label="Ngày sinh"
              value={convertToVietnamTime(
                userInfo?.birthDay
              )}
            />

            <InfoRow
              label="Địa chỉ"
              value={userInfo?.recentLocation}
            />
            <InfoRow
              label="Quê quán"
              value={userInfo?.originLocation}
            />
          </div>

          <div className="flex flex-col gap-2.5 shadow-[0_0_12px_2px_rgba(0,0,0,0.1)] rounded-xl p-5">
            <InfoRow
              label="Số CCCD"
              value={userInfo?.citizenIdentification}
            />
            <InfoRow
              label="Ngày cấp"
              value={convertToVietnamTime(
                userInfo?.issueDate
              )}
            />
            <InfoRow
              label="Ngày hết hạn"
              value={convertToVietnamTime(
                userInfo?.validDate
              )}
            />
            <InfoRow
              label="Nơi cấp"
              value={userInfo?.issueBy}
            />
            <InfoRow
              label="Quốc tịch"
              value={userInfo?.nationality}
            />
          </div>
        </div>
      </Spin>
    </CustomModal>
  );
};

export default UserProfile;
