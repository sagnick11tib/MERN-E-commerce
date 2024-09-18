import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductsResponse } from "../../types/api-types";

export const productAPI = createApi({
    reducerPath: "productAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/products/`,
    }),
    tagTypes: ["product"],
    endpoints: (builder)=>({
        latestProducts: builder.query<AllProductsResponse,string>({//AllProductsResponse is the type of data that will be returned by the query
            query: () => "latest",
            providesTags: ["product"] 
        }),
        
    })
});

export const { useLatestProductsQuery } = productAPI;

