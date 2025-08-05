import { memo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import UserProfile from "../../../pages/User/UserProfile/UserProfile";
import AuthServices from "../../../services/AuthServices";
import ChangePassword from "../../../pages/User/UserProfile/EditAccount/ChangePassword";
import EditProfile from "../../../pages/User/UserProfile/EditProfile/EditProfile";
import { logout } from "../../../store/authReduxs/authSlice";

import UserDropdown from "../../../components/UserDropdown";
import NotificationDropdown from "../../../components/Notification";
import type { RootState } from "../../../store/store";

const HeaderCompany = memo(() => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showInfo, setShowInfo] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [isUpdateProfile, setIsUpdateProfile] = useState(true);

  const handleLogout = async () => {
    try {
      const res = await AuthServices.logout();
      if (res?.code === 200) {
        dispatch(logout());
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(logout());
      navigate("/", { replace: true });
    }
  };

  const isExpired = user?.isExpired ?? true;

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-sky-100 to-sky-50 shadow-md border-b border-sky-200">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 md:px-10 lg:px-12">
        <div className="text-xl font-bold text-sky-700">DIGITAL AUCTION</div>
        <div className="flex items-center gap-3 text-sky-700">
          <div className="text-sm font-normal">
            <NotificationDropdown />
          </div>
          <div className="text-sm font-normal">
            <UserDropdown
              onShowInfo={() => setShowInfo(true)}
              onChangePassword={() => setChangePassword(true)}
              onLogout={handleLogout}
            />
          </div>
          <span className="hidden sm:inline-block font-medium text-[18px] text-sky-700">
            {user?.name}
          </span>
        </div>
      </div>

      {showInfo && (
        <UserProfile open={showInfo} onCancel={() => setShowInfo(false)} />
      )}
      {changePassword && (
        <ChangePassword
          open={changePassword}
          onCancel={() => setChangePassword(false)}
        />
      )}
      {isExpired && (
        <EditProfile
          open={isUpdateProfile}
          onCancel={() => setIsUpdateProfile(false)}
        />
      )}
    </header>
  );
});

export default HeaderCompany;
