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
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1), // it will return first date of last month//1 means first day of last month
            end: new Date(today.getFullYear(), today.getMonth(), 0) // it will return last date of last month//0 means last day of last month
        };

        const thisMonthProductsPromise = await Product.find({ //find all products that are created in this month
            createdAt: {
                $gte: thisMonth.start,//give me all products that are created after or on the first day of this month
                $lte: thisMonth.end//give me all products that are created before or on the last day of this month

                //return the array of products that are created in this month
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

        const latestTransactionsPromise = Order.find({})
        .select(["orderItems", "discount", "total", "status"])
        .limit(4);

        const [
            thisMonthProducts,
            thisMonthUsers,
            thisMonthOrders,
            lastMonthProducts,
            lastMonthUsers,
            lastMonthOrders,
            productsCount,
            usersCount,
            allOrders,
            lastSixMonthOrders,
            categories,
            femaleUsersCount,
            latestTransaction,
              ] = await Promise.all([
                                        thisMonthProductsPromise,
                                        thisMonthUsersPromise,
                                        thisMonthOrdersPromise,
                                        lastMonthProductsPromise,
                                        lastMonthUsersPromise,
                                        lastMonthOrdersPromise,
                                        Product.countDocuments(),
                                        User.countDocuments(),
                                        Order.find({}).select("total"),
                                        lastSixMonthOrdersPromise,
                                        Product.distinct("category"),
                                        User.countDocuments({ gender: "female"}),
                                        latestTransactionsPromise
                                    ]); //this will return all the promises in an array in the same order as they are written

        const thisMonthRevenue = thisMonthOrders.reduce((total, order) => total + (order.total || 0), 0);   //this will return the total revenue of this month by adding all the orders total
        // reduce has 2 parameters, 1st is a callback function and 2nd is the initial value of total here it is 0
        
        const lastMonthRevenue = lastMonthOrders.reduce((total, order) => total + (order.total || 0), 0);

        const revenue = allOrders.reduce((total, order) => total + (order.total || 0), 0);

        const count = {

            revenue,
            user: usersCount,
            product: productsCount,
            order: allOrders.length,
        }

        const orderMonthCounts = new Array(6).fill(0);
        const orderMonthyRevenue = new Array(6).fill(0);

        lastSixMonthOrders.forEach((order) => {
            const creationDate = order.createdAt;
            const monthDiff = today.getMonth() - creationDate.getMonth();

            if ( monthDiff < 6 ) {
                orderMonthCounts[6 - monthDiff - 1] += 1;
                orderMonthyRevenue[6 - monthDiff - 1] += order.total;
            }
        });

        const categoriesCountPromise = categories.map( category => Product.countDocuments({ category }) );

        const categoriesCount = await Promise.all(categoriesCountPromise);

        const categoryCount: Record<string, number>[] = [];
        // Record<string, number> is a type that defines an object with string keys and number values

        categories.forEach((category, index) => {
            categoryCount.push({
                [category]: Math.round((categoriesCount[index]/productsCount) * 100) //this will calculate the percentage of each category
            });
        });

        const userRation = {
            male: usersCount - femaleUsersCount,
            female: femaleUsersCount
        };

        const modifiedLatestTransaction = latestTransaction.map((i) => ({
            _id: i._id,
            discount: i.discount,
            amount: i.total,
            quantity: i.orderItems.length,
            status: i.status,
          }));

        const changePercent = {
            revenue: calculatePercentage( //this will calculate the percentage change in revenue
                thisMonthRevenue,
                lastMonthRevenue
            ),

            product: calculatePercentage( //this will calculate the percentage change in products (ho)
                thisMonthProducts.length,
                lastMonthProducts.length
            ),

            user: calculatePercentage(
                thisMonthUsers.length,
                lastMonthUsers.length
            ),

            order: calculatePercentage(
                thisMonthOrders.length,
                lastMonthOrders.length
            )
        }

        stats = {
            categoryCount,
            count,
            chart: {
                order: orderMonthCounts,
                revenue: orderMonthyRevenue
            },
            userRation,
            latestTransaction: modifiedLatestTransaction
        }

        nodeCache.set("admin-stats", JSON.stringify(stats)); //it will store the stats in cache

    }

    return res.status(200).json(new ApiResponse(200,stats,"Dashboard stats fetched successfully"));
});

const getPieCharts = asyncHandlerPromise(async (req,res)=>{});
const getBarCharts = asyncHandlerPromise(async (req,res)=>{});
const getLineCharts = asyncHandlerPromise(async (req,res)=>{});

export { getDashboardStats, getPieCharts, getBarCharts, getLineCharts };