import { apiSlice } from "./apiSlice";

let headers = {};

if (localStorage.getItem("access")) {
  headers = {
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  };
}

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/api/token/",
        method: "POST",
        headers,
        body: data,
      }),
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/api/users/register/",
        method: "POST",
        headers,
        body: data,
      }),
    }),
  }),
});

export const { useLoginUserMutation, useRegisterUserMutation } = usersApiSlice;
