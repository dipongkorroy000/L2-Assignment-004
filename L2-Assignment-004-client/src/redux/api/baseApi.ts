import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://l2-assignment-004-backend.vercel.app/api" }),

  tagTypes: ["books"],

  endpoints: (build) => ({
    getBooks: build.query({
      query: ({ filter, sort, limit, page }) =>
        `/books?filter=${filter}&sort=${sort}&limit=${limit}&page=${page}`,
      providesTags: ["books"],
    }),

    updateBook: build.mutation({
      query: ({ bookId, formData }) => ({
        url: `books/${bookId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["books"],
    }),

    getBook: build.query({
      query: (bookId) => `books/${bookId}`,
      providesTags: ["books"],
    }),

    deleteBook: build.mutation({
      query: (bookId) => ({
        url: `books/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["books"],
    }),

    addBook: build.mutation({
      query: (book) => ({
        url: `/books`,
        method: "POST",
        body: book,
      }),
      invalidatesTags: ["books"],
    }),

    getBorrow: build.query({
      query: () => "/borrow",
      providesTags: ["books"],
    }),

    addBorrow: build.mutation({
      query: (borrow) => ({
        url: `/borrow`,
        method: "POST",
        body: borrow,
      }),
      invalidatesTags: ["books"],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useUpdateBookMutation,
  useGetBookQuery,
  useDeleteBookMutation,
  useAddBookMutation,
  useGetBorrowQuery,
  useAddBorrowMutation,
} = baseApi;
