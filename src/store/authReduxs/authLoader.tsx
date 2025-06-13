import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, logout } from "./authSlice";
import type { AppDispatch } from "../store";
import AuthServices from "../../services/AuthServices";

const AuthLoader = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadUserFromServer = async () => {
      try {
        const res = await AuthServices.verify();

        if (res.status === 200) {
          const user = await res.data;
          dispatch(setUser(user));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        dispatch(logout());
      }
    };

    loadUserFromServer();
  }, [dispatch]);

  return null;
};

export default AuthLoader;
