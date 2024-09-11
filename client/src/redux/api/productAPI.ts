import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productAPI = createApi({
    reducerPath: "productAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
    }),
    tagTypes: ["product"],
    endpoints: (builder)=>({
        latestProducts: builder.query({
            query: () => "latest",
            providesTags: ["product"]
        }),
        
    })
})