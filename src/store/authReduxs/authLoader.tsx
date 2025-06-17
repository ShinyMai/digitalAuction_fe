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
      console.log(
        "Current path:",
        currentPath,
        "User role:",
        user.roleName
      );
      if (user.roleName !== "User") {
        if (!currentPath.startsWith("/company")) {
          navigate("/company/auction-list", {
            replace: true,
          });
        }
      } else if (user.roleName === "User") {
        if (currentPath.startsWith("/company")) {
          navigate("/", { replace: true });
        }
      }
    }
  }, [user, navigate, location.pathname]);

  return null;
};

export default AuthLoader;
