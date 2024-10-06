import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LatestProductsResponse, AllProductsResponse, ProductResponse, ProductDetailsResponse, MessageResponse, UpdateProductRequest, DeleteProductRequest, CategoriesResponse, SearchProductsResponse, SearchProductsRequest, NewProductRequest } from "../../types/api-types";

export const productAPI = createApi({
    reducerPath: "productAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/products/`,
    }),
    tagTypes: ["product"],
    endpoints: (builder)=>({
        latestProducts: builder.query<LatestProductsResponse,string>({//AllProductsResponse is the type of data that will be returned by the query
            query: () => "latest",
            providesTags: ["product"] 
        }),
        allProducts: builder.query<AllProductsResponse, string>({
            query: (id) => `admin-products?_id=${id}`,
            providesTags: ["product"]
        }),
        productDetails: builder.query<ProductDetailsResponse, string>({
            query: (id) => id,
            providesTags: ["product"]
        }),
        updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
            query: ({ formData, userId, productId }) => ({
                url:`${productId}?_id=${userId}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["product"]
        }),
        deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
            query: ({ userId, productId}) => ({
                url: `${productId}?_id=${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["product"]
        }),
        categories: builder.query<CategoriesResponse, string>({
            query: () => `categories`,
            providesTags: ["product"],
        }),
        searchProducts: builder.query<SearchProductsResponse,SearchProductsRequest>({
            query: ({ price, search, sort, category, page}) => {
                let base = `all?search=${search}&page=${page}`;
                
                if (price) base += `&price=${price}`; 
                if (sort) base += `&sort=${sort}`;
                if (category) base += `&category=${category}`;                

                return base;
            },
            providesTags: ["product"]
        }),
        newProduct: builder.mutation<MessageResponse, NewProductRequest>({
            query: ({ formData, _id }) => ({
                url: `new?_id=${_id}`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["product"]
        }),
    })
});

export const { useLatestProductsQuery,
               useAllProductsQuery,
               useProductDetailsQuery, 
               useUpdateProductMutation, 
               useDeleteProductMutation, 
               useCategoriesQuery, 
               useSearchProductsQuery,
               useNewProductMutation,
               
            } = productAPI;

