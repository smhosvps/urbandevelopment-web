import { api } from "@/redux/api/apiSlice";

export const faqApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createFaq: builder.mutation({
            query: (data) => ({
                url: "create-faq",
                method: "POST",
                body: data,
                credentials: "include" as const
            })
        }),
        getAllFaq: builder.query({
            query: () => ({
                url: "get-faq",
                method: "GET",
                credentials: "include" as const
            })
        }),
        deleteFaq: builder.mutation({
            query: (id) => ({
                url: `delete-faq/${id}`,
                method: "DELETE",
                credentials: "include" as const
            })
        }),
        editFaq: builder.mutation({
            query: ({ id, data }) => ({
                url: `update-faq/${id}`,
                method: "PUT",
                body: data,
                credentials: "include" as const
            })
        }),

    })
})

export const {
useGetAllFaqQuery,
useDeleteFaqMutation,
useCreateFaqMutation,
useEditFaqMutation

} = faqApi;