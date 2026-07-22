import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000",
    credentials: "include",                 // IMPORTANT: sends the HTTP-only cookie
  }),
  endpoints: (builder) => ({
    getMe: builder.query({                  // will be used to check login status.
      query: () => "/users/me/",
    }),
    getMyAppointments: builder.query({
      query: () => ({
        url: "/appointments/mine/",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetMeQuery, useGetMyAppointmentsQuery } = api;       // This gives you a React hook
