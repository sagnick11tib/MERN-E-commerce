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
        pinCode: "",
        phoneno: 0,
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

        calculatePrice: (state) => {
            
            const subtotal = state.cartItems.reduce( // calculate subtotal of all items
                (total, item) => total + item.price * item.quantity, 0 // initial value of total is 0 then add price of each item
            );

            state.subtotal = subtotal;
            state.shippingCharges = state.subtotal > 1000 ? 0 : 200;
            state.tax = Math.round(state.subtotal * 0.18);
            state.total = state.subtotal + state.tax + state.shippingCharges - state.discount;
        },

        discountApplied: (state, action: PayloadAction<number>) => {

            state.discount = action.payload;

        },

        saveCoupon: (state, action: PayloadAction<string>) => {

            state.coupon = action.payload;

        },

        saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {

            state.shippingInfo = action.payload;

        },

        resetCart: () => initialState,

    }
});

export const {

                addToCart, 
                removeCartItem,
                calculatePrice,
                discountApplied,
                saveCoupon,
                saveShippingInfo,
                resetCart    
            
            } = cartReducer.actions;