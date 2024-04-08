import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./slices/authSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./slices/apiSlice";

const store = configureStore({
  reducer:{
    auth: AuthSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().concat(apiSlice.middleware)
  ),
  devTools: true
})

export type RootState = ReturnType<typeof store.getState>;
setupListeners(store.dispatch);
export default store