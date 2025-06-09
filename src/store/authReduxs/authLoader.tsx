import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTokens, setUser } from "./authSlice";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../store";

const AuthLoader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    if (accessToken && user) {
      dispatch(setTokens({ accessToken }));
      dispatch(setUser(user));
      if (user.role) {
        if (user.role === "patient") {
          // navigate("/");
        } else {
          navigate(`/${user.role}`);
        }
      }
    }
  }, [dispatch, navigate]);

  return null;
};

export default AuthLoader;
