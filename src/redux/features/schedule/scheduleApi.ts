import { api } from "@/redux/api/apiSlice";

export const scheduleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSchedule: builder.mutation({
      query: ({ info, date }) => ({
        url: "admin-create-schedule",
        method: "POST",
        body: { info, date },
        credentials: "include" as const,
      }),
    }),
    getAllSchedule: builder.query({
      query: () => ({
        url: "admin-get-all-schedule",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    updateSchedule: builder.mutation({
      query: ({ id, info, date }) => ({
        url: `admin-edit-schedule/${id}`,
        method: "PUT",
        body: { info, date },
        credentials: "include" as const,
      }),
    }),
    deleteSchedule: builder.mutation({
      query: (id) => ({
        url: `admin-delete-schedule/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
    useCreateScheduleMutation,
    useDeleteScheduleMutation,
    useGetAllScheduleQuery,
    useUpdateScheduleMutation
} = scheduleApi;
