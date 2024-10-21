import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js"
import { Product } from "../models/product.models.js";
import { Order } from "../models/order.models.js";
import { nodeCache } from "../app.js";
import { calculatePercentage, getCategories, getChartData } from "../utils/features.js";



// const getDashboardStats = asyncHandler(async (req,res)=>{

//     let stats = {};

//     const key = "admin-stats";

//     if(nodeCache.has(key)) stats = JSON.parse(nodeCache.get(key) as string);
//     else{
//         const today = new Date();
//         const sixMonthsAgo = new Date();
//         sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6); 

//         const thisMonth = {
//             start: new Date(today.getFullYear(), today.getMonth(), 1), // it will return first date of this month
//             end: today // it will return today's date
//         };

//         const lastMonth = {
//             start: new Date(today.getFullYear(), today.getMonth() - 1, 1), // it will return first date of last month//1 means first day of last month
//             end: new Date(today.getFullYear(), today.getMonth(), 0) // it will return last date of last month//0 means last day of last month
//         };

//         const thisMonthProductsPromise = await Product.find({ //find all products that are created in this month
//             createdAt: {
//                 $gte: thisMonth.start,//give me all products that are created after or on the first day of this month
//                 $lte: thisMonth.end//give me all products that are created before or on the last day of this month

//                 //return the array of products that are created in this month
//             }
//         });

//         const lastMonthProductsPromise = await Product.find({
//             createdAt:{
//                 $gte: lastMonth.start,
//                 $lte: lastMonth.end
//             }
//         });

//         const thisMonthUsersPromise = await User.find({
//             createdAt:{
//                 $gte: thisMonth.start,
//                 $lte: thisMonth.end
//             }
//         });

//         const lastMonthUsersPromise = await User.find({
//             createdAt:{
//                 $gte: lastMonth.start,
//                 $lte: lastMonth.end
//             }
//         });

//         const thisMonthOrdersPromise = await Order.find({
//             createdAt:{
//                 $gte: thisMonth.start,
//                 $lte: thisMonth.end
//             }
//         });

//         const lastMonthOrdersPromise = await Order.find({
//             createdAt:{
//                 $gte: lastMonth.start,
//                 $lte: lastMonth.end
//             }
//         });

//         const lastSixMonthOrdersPromise = await Order.find({ // it will return all orders from last 6 months
//             createdAt:{
//                 $gte: sixMonthsAgo,
//                 $lte: today
//             },
//         });

//         const latestTransactionsPromise = Order.find({})
//         .select(["orderItems", "discount", "total", "status"])
//         .limit(4);

//         const [
//             thisMonthProducts,
//             thisMonthUsers,
//             thisMonthOrders,
//             lastMonthProducts,
//             lastMonthUsers,
//             lastMonthOrders,
//             productsCount,
//             usersCount,
//             allOrders,
//             lastSixMonthOrders,
//             categories,
//             femaleUsersCount,
//             latestTransaction,
//               ] = await Promise.all([
//                                         thisMonthProductsPromise,
//                                         thisMonthUsersPromise,
//                                         thisMonthOrdersPromise,
//                                         lastMonthProductsPromise,
//                                         lastMonthUsersPromise,
//                                         lastMonthOrdersPromise,
//                                         Product.countDocuments(),
//                                         User.countDocuments(),
//                                         Order.find({}).select("total"),
//                                         lastSixMonthOrdersPromise,
//                                         Product.distinct("category"),
//                                         User.countDocuments({ gender: "female"}),
//                                         latestTransactionsPromise
//                                     ]); //this will return all the promises in an array in the same order as they are written

//         const thisMonthRevenue = thisMonthOrders.reduce((total, order) => total + (order.total || 0), 0);   //this will return the total revenue of this month by adding all the orders total
//         // reduce has 2 parameters, 1st is a callback function and 2nd is the initial value of total here it is 0
        
//         const lastMonthRevenue = lastMonthOrders.reduce((total, order) => total + (order.total || 0), 0);

//         const revenue = allOrders.reduce((total, order) => total + (order.total || 0), 0);

//         const count = {
//             revenue,
//             user: usersCount,
//             product: productsCount,
//             order: allOrders.length,
//         }

//         const orderMonthCounts = getChartData({ length: 6, docArr: lastSixMonthOrders, today });

//         const orderMonthyRevenue = getChartData({ length: 6, docArr: lastSixMonthOrders, today, property: "total" });

//         const categoryCount: Record<string, number>[] = await getCategories({ categories, productsCount });
//         // Record<string, number> is a type that defines an object with string keys and number values

//         const userRatio = {
//             male: usersCount - femaleUsersCount,
//             female: femaleUsersCount
//         };

//         const modifiedLatestTransaction = latestTransaction.map((i) => ({
//             _id: i._id,
//             discount: i.discount,
//             amount: i.total,
//             quantity: i.orderItems.length,
//             status: i.status,
//           }));

//         const changePercent = {
//             revenue: calculatePercentage( //this will calculate the percentage change in revenue
//                 thisMonthRevenue,
//                 lastMonthRevenue
//             ),

//             product: calculatePercentage( //this will calculate the percentage change in products (ho)
//                 thisMonthProducts.length,
//                 lastMonthProducts.length
//             ),

//             user: calculatePercentage(
//                 thisMonthUsers.length,
//                 lastMonthUsers.length
//             ),

//             order: calculatePercentage(
//                 thisMonthOrders.length,
//                 lastMonthOrders.length
//             )
//         }

//         stats = {
//             categoryCount,
//             changePercent,
//             count,
//             chart: {
//                 order: orderMonthCounts,
//                 revenue: orderMonthyRevenue
//             },
//             userRatio,
//             latestTransaction: modifiedLatestTransaction
//         }

//         nodeCache.set(key, JSON.stringify(stats)); //it will store the stats in cache

//     }

//     return res.status(200).json(new ApiResponse(200,stats,"Dashboard stats fetched successfully"));
// });

const getDashboardStats = asyncHandler(async (_,res)=>{

    let stats = {};

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

        console.log(lastMonthProductsPromise)

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

        const orderMonthCounts = getChartData({ length: 6, docArr: lastSixMonthOrders, today });

        const orderMonthyRevenue = getChartData({ length: 6, docArr: lastSixMonthOrders, today, property: "total" });

        const categoryCount: Record<string, number>[] = await getCategories({ categories, productsCount });
        // Record<string, number> is a type that defines an object with string keys and number values

        const userRatio = {
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
          console.log(thisMonthProducts.length)
            console.log(lastMonthProducts.length)
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
            changePercent,
            count,
            chart: {
                order: orderMonthCounts,
                revenue: orderMonthyRevenue
            },
            userRatio,
            latestTransaction: modifiedLatestTransaction
        }

    return res.status(200).json(new ApiResponse(200,stats,"Dashboard stats fetched successfully"));
});

const getPieCharts = asyncHandler(async (req,res)=>{

    let charts: Record<string, any> = {};

    const key = "admin-pie-charts";

    if(nodeCache.has(key)) charts = JSON.parse(nodeCache.get(key) as string);
    else{

        const [
            processingOrder,
            shippedOrder,
            deliveredOrder,
            categories,
            productsCount,
            productsOutOfStock,
            allOrders,
            allUsers,
            adminUsers,
            customerUsers,


        ] = await Promise.all([

            Order.countDocuments({status: "Processing"}),
            Order.countDocuments({status: "Shipped"}),
            Order.countDocuments({status: "Delivered"}),
            Product.distinct("category"),
            Product.countDocuments(),
            Product.countDocuments({stock: 0}), //it will return which products stock is 0
            Order.find({}).select(["total","subtotal","discount","tax","shippingcharges"]),
            User.find({}).select(["dob"]),
            User.countDocuments({role: "admin"}),
            User.countDocuments({role: "user"}),

        ]);

        const orderFullfillment = {
            processing: processingOrder,
            shipped: shippedOrder,
            delivered: deliveredOrder
        };

        const productCategories = await getCategories({ categories, productsCount });

        const stockAvailability = {
            inStock: productsCount - productsOutOfStock,
            outOfStock: productsOutOfStock
        }

        const grossIncome = allOrders.reduce( //grossIncome means total income before any deductions
            (prev, order) => prev + (order.total || 0),0 //how? it will add all the orders total, if total is not present then it will add 0
        )

        const discount = allOrders.reduce(
            (prev, order) => prev + (order.discount || 0),0
        )

        const productionCost = allOrders.reduce(
            (prev, order) => prev + (order.shippingcharges || 0),0
        )

        const burnt = allOrders.reduce( //burnt means the amount that is burnt in the form of tax
            (prev, order) => prev + (order.tax || 0),0
        )

        const marketingCost = Math.round(grossIncome * (30 / 100)); //it will calculate the marketing cost which is 30% of the gross income

        const netMargin = grossIncome - discount - productionCost - burnt - marketingCost;

        const revenueDistribution = {
            netMargin: netMargin,
            discount: discount,
            productionCost: productionCost,
            burnt: burnt,
            marketingCost: marketingCost
        }

        const usersAgeGroup = {
            teen: allUsers.filter((user)=> user.age < 20).length,
            adult: allUsers.filter((user)=> user.age >= 20 && user.age < 40).length,
            old: allUsers.filter((user)=> user.age >= 40).length
        }

        const adminCustomer = {
            admin: adminUsers,
            customer: customerUsers
        }

        charts = {
            orderFullfillment: orderFullfillment,
            productCategories: productCategories,
            stockAvailability: stockAvailability,
            revenueDistribution: revenueDistribution,
            usersAgeGroup: usersAgeGroup,
            adminCustomer: adminCustomer
        }

        nodeCache.set(key, JSON.stringify(charts));

    }

    return res.status(200).json(new ApiResponse(200,charts,"Pie charts fetched successfully"));
});

const getBarCharts = asyncHandler(async (req,res)=>{
    let charts: Record<string, any> = {};
    const key = "admin-bar-charts";
    if(nodeCache.has(key)) charts = JSON.parse(nodeCache.get(key) as string);
    else{
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const sixMonthProductPromise = Product.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today
            }
        }).select("createdAt");

        const sixMonthUserPromise = User.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today
            }
        }).select("createdAt");

        const twelveMonthOrdersPromise = Order.find({
            createdAt: {
                $gte:twelveMonthsAgo,
                $lte:today
            }
        }).select("createdAt");
         
        const [
            products,
            users,
            orders
        ] = await Promise.all([
            sixMonthProductPromise,
            sixMonthUserPromise,
            twelveMonthOrdersPromise
        ]);

        const productCounts = getChartData({ length: 6, docArr: products, today});
        const userCounts = getChartData({ length: 6, docArr: users, today});
        const orderCounts = getChartData({ length: 12, docArr: orders, today});


        charts ={
            users: userCounts,
            products: productCounts,
            orders: orderCounts
        }

        nodeCache.set(key, JSON.stringify(charts));
    }

    return res.status(200).json(new ApiResponse(200,charts,"Bar charts fetched successfully"));

});

const getLineCharts = asyncHandler(async (req,res)=>{
    
    let charts: Record<string, any> = {};

    const key = "admin-line-charts";

    if(nodeCache.has(key)) charts = JSON.parse(nodeCache.get(key) as string);
    else{

        const today = new Date();

        const twelveMonthsAgo = new Date();

        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const baseQuery = {
            createdAt: {
                $gte: twelveMonthsAgo,
                $lte: today
            }
        };

        const [products, users, orders] = await Promise.all([
            Product.find(baseQuery).select("createdAt"),
            User.find(baseQuery).select("createdAt"),
            Order.find(baseQuery).select(["createdAt","total","discount"]),
        ]);

        const productCounts = getChartData({ length: 12, docArr: products, today});
        const userCounts = getChartData({ length: 12, docArr: users, today});
        const discount = getChartData({ length: 12, docArr: orders, today, property: "discount"});
        const revenue = getChartData({ length: 12, docArr: orders, today, property: "total"});

        charts = {
            users: userCounts,
            products: productCounts,
            discount: discount,
            revenue: revenue
        }

        nodeCache.set(key, JSON.stringify(charts));
    }

    return res.status(200).json(new ApiResponse(200,charts,"Line charts fetched successfully"));

});

export { getDashboardStats, getPieCharts, getBarCharts, getLineCharts };