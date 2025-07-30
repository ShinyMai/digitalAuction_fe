import { useEffect, useState, useCallback } from "react";
import CustomModal from "../../../components/Common/CustomModal";
import { useSelector } from "react-redux";
import { Button, Tooltip } from "antd";
import UserServices from "../../../services/UserServices";
import { convertToVietnamTime } from "../../../utils/timeConfig";
import { EditOutlined, UserOutlined, IdcardOutlined } from "@ant-design/icons";
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
      title={
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold text-gray-800">
            Thông tin cá nhân
          </span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={900}
      footer={null}
      style={{ top: 20 }}
      className="profile-modal"
    >
      <div className="relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-blue-600 font-semibold">
                Đang tải thông tin...
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Personal Info Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 relative overflow-hidden">
            {/* Edit Button */}
            <div className="absolute top-4 right-4 z-20">
              <Tooltip title="Chỉnh sửa thông tin liên lạc">
                <Button
                  onClick={() => setEditAccountOpen(true)}
                  className="!w-12 !h-12 !rounded-full !border-0 !bg-white/80 !backdrop-blur-sm !hover:bg-white !hover:scale-110 !transition-all !duration-300 !shadow-lg !flex !items-center !justify-center !cursor-pointer"
                >
                  <EditOutlined className="text-blue-600 text-lg" />
                </Button>
              </Tooltip>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200/30 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-indigo-300/20 rounded-full blur-lg"></div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <UserOutlined className="text-white text-sm" />
                </div>
                Thông tin cơ bản
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">
                      Họ và tên
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {userInfo?.name || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">Chức vụ</p>
                    <p className="text-lg font-bold text-gray-800">
                      {userInfo?.roleName || "Chưa xác định"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">
                      Số điện thoại
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {userInfo?.phoneNumber || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">Email</p>
                    <p className="text-lg font-bold text-gray-800 break-all">
                      {userInfo?.email || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Detailed Info Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-200/30 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-300/20 rounded-full blur-lg"></div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">📊</span>
                </div>
                Thông tin chi tiết
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">
                      Giới tính
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {userInfo?.gender === true ? "Nam" : "Nữ"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">
                      Ngày sinh
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {convertToVietnamTime(userInfo?.birthDay) ||
                        "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">
                      Địa chỉ hiện tại
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {userInfo?.recentLocation || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">
                      Quê quán
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {userInfo?.originLocation || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ID Card Info Section */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-200/30 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-amber-300/20 rounded-full blur-lg"></div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <IdcardOutlined className="text-white text-sm" />
                </div>
                Thông tin CCCD
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">Số CCCD</p>
                    <p className="text-lg font-bold text-gray-800">
                      {userInfo?.citizenIdentification || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">
                      Ngày cấp
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {convertToVietnamTime(userInfo?.issueDate) ||
                        "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">
                      Ngày hết hạn
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {convertToVietnamTime(userInfo?.validDate) ||
                        "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">
                      Quốc tịch
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {userInfo?.nationality || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl md:col-span-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">Nơi cấp</p>
                    <p className="text-lg font-bold text-gray-800">
                      {userInfo?.issueBy || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditAccount
        open={editAccountOpen}
        onCancel={() => setEditAccountOpen(false)}
      />
    </CustomModal>
  );
};

export default UserProfile;
