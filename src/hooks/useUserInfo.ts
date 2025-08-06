import { useState, useEffect } from "react";
import UserServices from "../services/UserServices";

interface UserInfo {
  name?: string;
  email?: string;
  citizenIdentification?: string;
  phoneNumber?: string;
  roleName?: string;
}

export const useUserInfo = (userId: string | null) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setUserInfo(null);
      return;
    }

    const fetchUserInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await UserServices.getUserInfo({ user_id: userId });
        if (response?.data) {
          setUserInfo(response.data);
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  return { userInfo, loading, error };
};

// Hook để lấy nhiều user info cùng lúc
export const useMultipleUserInfo = (userIds: string[]) => {
  const [usersInfo, setUsersInfo] = useState<Record<string, UserInfo>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!userIds.length) {
      setUsersInfo({});
      return;
    }

    const fetchMultipleUserInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        const promises = userIds.map(async (userId) => {
          try {
            const response = await UserServices.getUserInfo({
              user_id: userId,
            });
            return { userId, data: response?.data };
          } catch (err) {
            console.error(`Error fetching user info for ${userId}:`, err);
            return { userId, data: null };
          }
        });

        const results = await Promise.all(promises);
        const usersMap: Record<string, UserInfo> = {};

        results.forEach(({ userId, data }) => {
          if (data) {
            usersMap[userId] = data;
          }
        });

        setUsersInfo(usersMap);
      } catch (err) {
        console.error("Error fetching multiple user info:", err);
        setError("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchMultipleUserInfo();
  }, [userIds]); // Use userIds directly as dependency

  return { usersInfo, loading, error };
};

// Hook để lấy thông tin user hiện tại từ localStorage/auth state
export const useCurrentUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Lấy thông tin user từ localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUserInfo({
          name: userData.name,
          email: userData.email,
          citizenIdentification: userData.citizenIdentification,
          phoneNumber: userData.phoneNumber,
          roleName: userData.roleName,
        });
      }
    } catch (error) {
      console.error("Error loading user info:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { userInfo, loading };
};
