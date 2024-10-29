import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.models.js";
import { NewOrderRequestBody } from "../types/types.js";
import { reduceStock } from "../utils/features.js";
import { invalidateCache } from "../utils/invalidCache.js";
import { redis } from "../index.js";



const newOrder = asyncHandler(async (req: Request<{}, {}, NewOrderRequestBody>, res, next)=> {

    const { shippingInfo, orderItems, user, subTotal, tax, shippingCharges, discount, total, status } = req.body;

    if( !shippingInfo || !orderItems || !user || !subTotal || !tax || !shippingCharges || !discount || !total || !status ) {

        throw new ApiError(400, "Please fill all the fields");
    };

    const order = await Order.create({ shippingInfo, orderItems, user, subtotal:subTotal, tax, shippingcharges:shippingCharges, discount, total, status });

    if (!order) throw new ApiError(500, "Order not placed");

    await reduceStock(orderItems);

     await invalidateCache({
        product: true,
        order: true,
        userId: user,
        admin: true,
        productId: order.orderItems.map((i) => String(i.productId)),
    });

    return res.status(201).json(new ApiResponse(201, { order }, "Order Placed Successfully"));

});

const myOrders = asyncHandler(async (req, res)=> {

    const { id: user } = req.query;

    const key = `myorders_${user}`;

    let orders: any = [];

    orders = await redis.get(key);

    if (orders) orders = JSON.parse(orders);
    else {
        orders = await Order.find({ user });

        if ( !orders ) throw new ApiError(404, "No Orders Found");

        await redis.setex(key, 200, JSON.stringify(orders));
    }

    return res.status(201).json(new ApiResponse(201, { orders }, "Orders fetched successfully"));

});


const allOrder = asyncHandler(async (req, res)=> {

    const key = `all-orders`;

        let orders: any=[];

        orders = await redis.get(key);

        if(orders) orders = JSON.parse(orders);

        else {
            orders = await Order.find().populate("user", "name");

            if (!orders) throw new ApiError(404, "No Orders Found");

            await redis.setex(key, 150, JSON.stringify(orders));
        }
  
     return res.status(201).json(new ApiResponse(201, { orders }, "All Order fetched Sucessfuly"));

});

const getSingleOrder = asyncHandler(async (req,res)=> {

    const { id } = req.params;

    const key = `order-${id}`;

    let order;

    order = await redis.get(key);

    if (order) order = JSON.parse(order);

    else {

        order = await Order.findById(id).populate("user", "name");
        if ( !order ) throw new ApiError(404, "Order Not Found");

        await redis.setex(key, 200, JSON.stringify(order))
    }

          return res.status(200)
                    .json(new ApiResponse(201, { order }, "Single order fetched Succesfully"))
});

const processOrder = asyncHandler(async (req,res)=> {

    const { id } = req.params;

    const order = await Order.findById(id);

    if( !order ) throw new ApiError(404, "Order not found");

    switch(order.status) {
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "Delivered";
            break;
        default:
            order.status = "Delivered"    ;
            break;

    }

    const updatedOrder = await order.save();



    await invalidateCache({ product: false, order: true, admin: true, userId: order.user, orderId: String(order._id) });

    return res.status(200).json(new ApiResponse(200, { order: updatedOrder }, "Order Processed Succesfully"));

});

const deleteOrder = asyncHandler(async (req,res)=> {

    const { id } = req.params;

    const order = await Order.findById(id);

    if ( !order ) throw new ApiError(404,"Order not Found");

    await order.deleteOne();

    invalidateCache({ product: false, order: true, admin: true, userId: order.user, orderId: String(order._id) });

    return res.status(200).json(new ApiResponse(200, { }, "Order deleted Succcesfully"))


})





export { newOrder, myOrders, allOrder, getSingleOrder, processOrder, deleteOrder };
