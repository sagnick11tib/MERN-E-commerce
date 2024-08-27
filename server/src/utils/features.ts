import { OrderItemType } from "../types/types.js";
import { Product } from "../models/product.models.js";
import { ApiError } from "./ApiError.js";

export const reduceStock = async (orderItems: OrderItemType[]) => {

    for(let i = 0; i< orderItems.length; i++){

        const order = orderItems[i];

        const product = await Product.findById(order.productId);

        if ( ! product ) throw new ApiError(404,"Product not found");

        product.stock -= order.quantity;

        await product.save();

    }
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {

    if (lastMonth === 0) return thisMonth * 100; 

    const percent = (thisMonth / lastMonth) * 100;

    return Number(percent.toFixed(0)); // toFixed(0) will remove decimal points

};




