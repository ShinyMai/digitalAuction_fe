import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  roleName: string;
  email: string;
  isExpired: boolean;
}

interface AuthState {
  user: User | null;
}

const getStoredUser = (): User | null => {
  const stored = localStorage.getItem("user");
  try {
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: getStoredUser(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem(
        "user",
        JSON.stringify(action.payload)
      );
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
