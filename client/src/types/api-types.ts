import { Product, User } from "./types";

export type MessageResponse = {
    success: boolean;
    message: string;
}

export type DeleteUserRequest = {
    userId: string;
    adminUserId: string;
}

export type UserResponse = {
    success: boolean;
    data: User;
}


export type latestProducts = {
    latestProducts: Product[];
}

export type AllProductsResponse = {
    success: boolean;
    data: latestProducts | undefined;
}