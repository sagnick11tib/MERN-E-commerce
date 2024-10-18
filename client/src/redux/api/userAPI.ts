import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../../types/types";
import { MessageResponse, DeleteUserRequest, UserResponse, AllUsersResponse } from "../../types/api-types";
import axios from "axios";

export const userAPI = createApi({ //helping to send the user data to the backend to store in the database using the login mutation
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
                url: `${userId}?_id=${adminUserId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ["users"]
        }),

        allUsers: builder.query<AllUsersResponse,string>({
            
            query: (id) => `all?_id=${id}`,
            providesTags: ["users"]
        })


    })
});

export const getUser = async(id: string) => {
    try {
        const { data }: { data: UserResponse } = await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/user/${id}`);
        
        return data;

    } catch (error) {
        throw error;
    }
}

export const { useLoginMutation, useDeleteUserMutation, useAllUsersQuery } = userAPI; //useLoginMutation is a hook that can be used to call the login mutation