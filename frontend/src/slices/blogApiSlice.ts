import { apiSlice } from "./apiSlice";

const PATH = "/api/posts/";

export const blogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: () => PATH,
    }),
    getSingleBlog: builder.query({
      query: (id) => PATH + id + "/",
    }),
    createNewBlog: builder.mutation({
      query: (data) => ({
        url: "/api/users/posts/",
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`, // Include JWT token in headers
        },
        body: data,
      }),
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/api/users/posts/${id}/delete/`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`, // Include JWT token in headers
        },
      }),
    }),
    updateBlog: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/users/posts/${id}/update/`,
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useGetSingleBlogQuery,
  useCreateNewBlogMutation,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
} = blogApiSlice;
