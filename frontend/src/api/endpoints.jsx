// src/api/endpoints.jsx
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AuthContext } from "../auth/AuthProvider.jsx"
import { useContext } from "react"

// --- Custom Base Query with Auto-Refresh ---
const customBaseQuery = (baseUrl) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    credentials: "include", // send cookies if needed
    prepareHeaders: (headers, { getState }) => {
      const access = getState().auth?.access
      if (access) headers.set("Authorization", `Bearer ${access}`)
      return headers
    }
  })

  return async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions)

    // If unauthorized → try refresh
    if (result.error && result.error.status === 401) {
      const refreshSuccess = await api.extra.refreshTokens()

      if (refreshSuccess) {
        // Retry original request
        return await rawBaseQuery(args, api, extraOptions)
      }

      // Refresh failed → logout
      api.extra.logout()
    }

    return result
  }
}

// --- Hook to inject AuthProvider actions into RTK Query ---
export function useApiExtra() {
  const auth = useContext(AuthContext)
  return {
    refreshTokens: auth.actions.refreshTokens,
    logout: auth.actions.logout
  }
}

// --- API Slice ---
export const api = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery("/"),
  tagTypes: ["User", "Appointments", "Stylists"],
  endpoints: (builder) => ({
    // --- Auth ---
    getMe: builder.query({
      query: () => "/users/me/",
      providesTags: ["User"]
    }),

    // --- Appointments ---
    getAppointments: builder.query({
      query: () => "/appointments/",
      providesTags: ["Appointments"]
    }),

    createAppointment: builder.mutation({
      query: (body) => ({
        url: "/appointments/",
        method: "POST",
        body
      }),
      invalidatesTags: ["Appointments"]
    }),

    updateAppointment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/appointments/${id}/`,
        method: "PUT",
        body
      }),
      invalidatesTags: ["Appointments"]
    }),

    deleteAppointment: builder.mutation({
      query: (id) => ({
        url: `/appointments/${id}/`,
        method: "DELETE"
      }),
      invalidatesTags: ["Appointments"]
    }),

    // --- Stylists ---
    getStylists: builder.query({
      query: () => "/stylists/",
      providesTags: ["Stylists"]
    })
  })
})

// --- Auto-generated hooks ---
export const {
  useGetMeQuery,
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetStylistsQuery
} = api
