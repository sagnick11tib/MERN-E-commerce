import { nodeCache } from "../app.js";
import { redis } from "../index.js";
import { InvalidateCacheProps } from "../types/types.js"

export const invalidateCache = async ({ 
                                        product,
                                        order,
                                        admin,
                                        review,
                                        userId,
                                        orderId,
                                        productId
                                      }: InvalidateCacheProps)=> {
 if (review) {
     await redis.del([`reviews-${productId}`]);
    }
    if(product) {
        const productKeys : string[] = [ 
            "latest-products", 
            "categories", 
            "all-products",
            `product-${productId}`
         ];

         if(typeof productId === "string") productKeys.push(`product-${productId}`);

         if(typeof productId === "object") {
            productId.forEach((i)=> productKeys.push(`product-${i}`))
        }

         await redis.del(productKeys);
    }
    if(order) {
        const orderKeys: string[] = ["all-orders", `myorders_${userId}`, `order-${orderId}`];

        await redis.del(orderKeys)
    }
    if(admin) {
        await redis.del([ 
            "admin-stats",
            "admin-pie-charts",
            "admin-bar-charts",
            "admin-line-charts",
        ])
    }
                                      } 
