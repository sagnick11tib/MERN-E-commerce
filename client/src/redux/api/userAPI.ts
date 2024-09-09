import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../types/types";
import { MessageResponse, DeleteUserRequest, UserResponse } from "../../types/api-types";
import axios from "axios";

export const userAPI = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/`,
    }),
    tagTypes: ["users"],
    endpoints: (builder) => ({
        login: builder.mutation<MessageResponse, User>({//<ResponseType,QueryArgumentType>
            query: (user) => ({
                url: "new",
                method: "POST",
                body: user
            }),
         invalidatesTags: ["users"]
        }),

        deleteUser: builder.mutation<MessageResponse,DeleteUserRequest>({ //<firstParameter is the return type of the mutation, secondParameter is the type of the request>
            query: ({ userId, adminUserId }) =>({
                url: `${userId}?id=${adminUserId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ["users"]
        }),


    })
});

export const getUser = async(id: string) => {
    try {
        const { data } = await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/user/${id}`);
        //console.log(data.data._id);

        return data;

    } catch (error) {
        throw error;
    }
}

export const { useLoginMutation, useDeleteUserMutation } = userAPI; //useLoginMutation is a hook that can be used to call the login mutation