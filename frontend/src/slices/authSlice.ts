import { createSlice } from "@reduxjs/toolkit";

// export interface AuthState {
//   userInfo: any | null
// }

const initialState /* AuthState */ = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') || "") : null
}

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    removeUserInfo: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    }
  }
})

export const {setUserInfo, removeUserInfo} = AuthSlice.actions;
export default AuthSlice;