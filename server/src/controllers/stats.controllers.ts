import { asyncHandlerPromise } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js"
import { Product } from "../models/product.models.js";
import { Order } from "../models/order.models.js";
import { nodeCache } from "../app.js";
import { calculatePercentage } from "../utils/features.js";


const getDashboardStats = asyncHandlerPromise(async (req,res)=>{

    let stats = {};

    if(nodeCache.has("admin-stats")) stats = JSON.parse(nodeCache.get("admin-stats") as string);
    else{
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6); 

        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1), // it will return first date of this month
            end: today // it will return today's date
        };

        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1), // it will return first date of last month
            end: new Date(today.getFullYear(), today.getMonth(), 0) // it will return last date of last month
        };

        const thisMonthProductsPromise = await Product.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end
            }
        });

        const lastMonthProductsPromise = await Product.find({
            createdAt:{
                $gte: lastMonth.start,
                $lte: lastMonth.end
            }
        });

        const thisMonthUsersPromise = await User.find({
            createdAt:{
                $gte: thisMonth.start,
                $lte: thisMonth.end
            }
        });

        const lastMonthUsersPromise = await User.find({
            createdAt:{
                $gte: lastMonth.start,
                $lte: lastMonth.end
            }
        });

        const thisMonthOrdersPromise = await Order.find({
            createdAt:{
                $gte: thisMonth.start,
                $lte: thisMonth.end
            }
        });

        const lastMonthOrdersPromise = await Order.find({
            createdAt:{
                $gte: lastMonth.start,
                $lte: lastMonth.end
            }
        });

        const lastSixMonthOrdersPromise = await Order.find({ // it will return all orders from last 6 months
            createdAt:{
                $gte: sixMonthsAgo,
                $lte: today
            },
        });

        const [
            thisMonthProducts,
            thisMonthUsers,
            thisMonthOrders,
            lastMonthProducts,
            lastMonthUsers,
            lastMonthOrders,
            lastSixMonthOrders
              ] = await Promise.all([
                                        thisMonthProductsPromise,
                                        thisMonthUsersPromise,
                                        thisMonthOrdersPromise,
                                        lastMonthProductsPromise,
                                        lastMonthUsersPromise,
                                        lastMonthOrdersPromise,
                                        lastSixMonthOrdersPromise
                                    ]);
        const productChangePercent = calculatePercentage(
            thisMonthProducts.length,
            lastMonthProducts.length
        );
        
        const userChangePercent = calculatePercentage(
            thisMonthUsers.length,
            lastMonthUsers.length
        );   
        
        const orderChangePercent = calculatePercentage(
            thisMonthOrders.length,
            lastMonthOrders.length
        );




    }
})