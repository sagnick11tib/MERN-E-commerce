import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllOrdersResponse, MessageResponse, NewOrderRequest, OrderDetailsResponse, UpdateOrderRequest } from "../../types/api-types";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/orders/`,
    }),
    tagTypes: ["orders"],
    endpoints: (builder) => ({
        newOrder: builder.mutation<MessageResponse, NewOrderRequest>({
            query: (order) => ({
                url: `new`,
                method: "POST",
                body: order,
            }),
            invalidatesTags: ["orders"],
        }),
        updateOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
            query: ({ userId, orderId }) => ({
                url: `${orderId}?_id=${userId}`,
                method: "PUT",
            }),
            invalidatesTags: ["orders"],    
        }),
        deleteOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
            query: ({ userId, orderId }) => ({
                url: `${orderId}?_id=${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["orders"],
        }),
        myOrder: builder.query<AllOrdersResponse, string>({
            query: (userId) => `my?id=${userId}`,
            providesTags: ["orders"],
        }),
        allOrders: builder.query<AllOrdersResponse, string>({
            query: (id) => `all?_id=${id}`,
            providesTags: ["orders"],
        }),
        orderDetails: builder.query<OrderDetailsResponse, string>({
            query: (id) => id,
            providesTags: ["orders"],
        }),
    }),
});

export const { useNewOrderMutation, useUpdateOrderMutation, useDeleteOrderMutation, useMyOrderQuery, useAllOrdersQuery, 
    useOrderDetailsQuery
 } = orderApi;