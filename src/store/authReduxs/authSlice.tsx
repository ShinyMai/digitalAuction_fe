import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type UserRole = "staff" | "auctioner";

interface User {
  id: string;
  name: string;
  role: UserRole;
  // Thêm các thuộc tính khác nếu cần
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
}

// Parse user từ localStorage nếu có
const getStoredUser = (): User | null => {
  const stored = localStorage.getItem("user");
  try {
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken") || null,
  user: getStoredUser(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      localStorage.setItem(
        "accessToken",
        action.payload.accessToken
      );
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem(
        "user",
        JSON.stringify(action.payload)
      );
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
  },
});

export const { setTokens, setUser, logout } =
  authSlice.actions;
export default authSlice.reducer;
