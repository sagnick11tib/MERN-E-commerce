import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/reducer-types";
import { CartItem, ShippingInfo } from "../../types/types";


const initialState: CartReducerInitialState = {
    loading: false,
    cartItems: [],
    subtotal: 0,
    tax: 0,
    shippingCharges: 0,
    discount: 0,
    total: 0,
    coupon: undefined,
    shippingInfo:{
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: ""
    }
};

export const cartReducer = createSlice({
    name: "cartReducer",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            state.loading = true;

            const index = state.cartItems.findIndex(
                (item) => item.productId === action.payload.productId
            );

            if (index !== -1) state.cartItems[index] = action.payload;
            else state.cartItems.push(action.payload);
            //state.cartItems.push(action.payload);
            state.loading = false;
        },

        removeCartItem: (state, action: PayloadAction<string>) => {
            state.loading = true;
            state.cartItems = state.cartItems.filter( 
                (item) => item.productId !== action.payload 
            );
            state.loading = false;
        },

        
    }
});

export const { addToCart, removeCartItem } = cartReducer.actions;