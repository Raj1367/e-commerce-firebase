// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setCookie, getCookie, deleteCookie } from '../Utils/Cookies';

interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: SerializableUser | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

// Check cookies on load to initialize state
const storedUser = getCookie('authUser');
if (storedUser) {
  const parsedUser: SerializableUser = JSON.parse(storedUser);
  initialState.isAuthenticated = true;
  initialState.user = parsedUser;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<SerializableUser>) => {
      const user = action.payload;
      setCookie('authUser', JSON.stringify(user), 7); // Set a cookie for 7 days
      return {
        ...state,
        isAuthenticated: true,
        user,
      };
    },
    logout: () => {
      deleteCookie('authUser'); // Remove the cookie on logout
      return initialState;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
