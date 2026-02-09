// import { api } from "@/redux/api/apiSlice"


// export const testimonyApi = api.injectEndpoints({
//     endpoints: (builder) => ({
//         getTestimonies: builder.query({
//             query: () => `all-testimony`,
//         }),
//         createTestimony: builder.mutation({
//             query: (newTestimony) => ({
//                 url: "create-testimony",
//                 method: "POST",
//                 body: newTestimony,
//             }),
//         }),
//         updateTestimony: builder.mutation({
//             query: ({ _id, ...patch }) => ({
//                 url: `update-testimony/${_id}`,
//                 method: "PUT",
//                 body: patch,
//             }),
//         }),
//         deleteTestimony: builder.mutation({
//             query: (id) => ({
//                 url: `delete-testimony/${id}`,
//                 method: "DELETE",
//             }),
//         }),
//     }),
// })

// export const {
//     useGetTestimoniesQuery,
//     useCreateTestimonyMutation,
//     useUpdateTestimonyMutation,
//     useDeleteTestimonyMutation,
// } = testimonyApi



import { api } from "@/redux/api/apiSlice"

export interface Testimony {
  _id: string
  category: string
  title: string
  name_of_testifier: string
  id_of_testifier?: string
  url_of_testifier?: string
  testimony: string
  isApprove?: boolean
  isRejected?: boolean
  country: string
  reason?: string
  createdAt?: string
  updatedAt?: string
}

export interface TestimonyResponse {
  success: boolean
  testimony: Testimony[]
}

export interface CreateTestimonyResponse {
  success: boolean
  message: string
  savedTestimony: Testimony
}

export interface UpdateTestimonyResponse {
  success: boolean
  message: string
  updatedTestimony: Testimony
}

export interface DeleteTestimonyResponse {
  success: boolean
  message: string
}

// Define the base URL for your API
export const testimonyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllTestimonies: builder.query<TestimonyResponse, void>({
      query: () => "all-testimony",
    }),

    createTestimony: builder.mutation<CreateTestimonyResponse, Partial<Testimony>>({
      query: (testimony) => ({
        url: "create-testimony",
        method: "POST",
        body: testimony,
      }),
    }),

    updateTestimony: builder.mutation<UpdateTestimonyResponse, { id: string } & Partial<Testimony>>({
      query: ({ id, ...testimony }) => ({
        url: `update-testimony/${id}`,
        method: "PUT",
        body: testimony,
      }),
    }),

    deleteTestimony: builder.mutation<DeleteTestimonyResponse, string>({
      query: (id) => ({
        url: `delete-testimony/${id}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  useGetAllTestimoniesQuery,
  useCreateTestimonyMutation,
  useUpdateTestimonyMutation,
  useDeleteTestimonyMutation,
} = testimonyApi

