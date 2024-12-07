import { createSlice} from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface userCredintials {
    token: string
    email: string | null;
}

interface AuthState {
    isAuthenticated: boolean;
    user: userCredintials | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
};

const storedUser = Cookies.get("userCredintials");

if (storedUser) {
    initialState.isAuthenticated = true;
    const parsedToken = JSON.parse(storedUser)
    initialState.user = parsedToken
}

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        login: (state, action) => {
            const userData = JSON.stringify(action.payload)
            Cookies.set("firebaseUserToken", userData, { expires: 7, secure: true })
            return {
                ...state,
                isAuthenticated: true,
                userData
            }
        },

        logout: () => {
            Cookies.remove("firebaseUserToken");
            return initialState;
        }
    }
})

export const { login, logout } = AuthSlice.actions
export default AuthSlice.reducer
