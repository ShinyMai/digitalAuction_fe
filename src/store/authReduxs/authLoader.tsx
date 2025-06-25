import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import type { RootState } from "../store";

const AuthLoader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(
    (state: RootState) => state.auth
  );
  useEffect(() => {
    if (user?.roleName) {
      const currentPath = location.pathname;
      const rolePath = user.roleName.toLowerCase();

      console.log(
        "Current path:",
        currentPath,
        "User role:",
        user.roleName
      );

      if (user.roleName !== "Customer") {
        // For company staff (Admin, Staff, etc.)
        if (!currentPath.startsWith(`/${rolePath}`)) {
          navigate(`/${rolePath}/statistics`, {
            replace: true,
          });
        }
      } else if (user.roleName === "Customer") {
        if (currentPath.startsWith(`/${rolePath}`)) {
          navigate("/", { replace: true });
        }
      }
    }
  }, [user, navigate, location.pathname]);

  return null;
};

export default AuthLoader;
