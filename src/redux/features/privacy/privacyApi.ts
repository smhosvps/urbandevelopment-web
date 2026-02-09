import { api } from "@/redux/api/apiSlice";

export const privacyApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createPrivacy: builder.mutation({
            query: ({ title, detail}) => ({
                url: "create-privacy",
                method: "POST",
                body: { title, detail},
                credentials: "include" as const
            })
        }),
        getAllPrivacy: builder.query({
            query: () => ({
                url: "get-privacy",
                method: "GET",
                credentials: "include" as const
            })
        }),
        editPolicy: builder.mutation({
            query: ({ id, data }) => ({
                url: `update-privacy/${id}`,
                method: "PUT",
                body: data,
                credentials: "include" as const
            })
        }),

    })
})

export const {
    useGetAllPrivacyQuery,
    useEditPolicyMutation,
    useCreatePrivacyMutation
} = privacyApi;