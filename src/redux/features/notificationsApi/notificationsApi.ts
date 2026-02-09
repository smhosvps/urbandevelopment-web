import { api } from "@/redux/api/apiSlice";


export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all notifications (admin)
    getAllNotifications: builder.query({
      query: () => 'get-notication',
    }),

    // Get current user notifications
    getCurrentUserNotifications: builder.query({
      query: (userId) => `get-all-current-user-notification/${userId}`,
    }),

    // Update notification status
    updateNotification: builder.mutation({
      query: (id) => ({
        url: `update-notication/${id}`,
        method: 'PUT',
      }),
    }),

    // Delete single notification
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `notifications/${id}`,
        method: 'DELETE',
      }),
    }),

    // Delete multiple notifications
    deleteBulkNotifications: builder.mutation({
      query: (body) => ({
        url: 'delete-bulk-notifications',
        method: 'DELETE',
        body,
      }),
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useGetCurrentUserNotificationsQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
  useDeleteBulkNotificationsMutation,
} = notificationApi;