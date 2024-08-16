import { nodeCache } from "../app.js";
import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js";
import { InvalidateCacheProps } from "../types/types.js"

export const invalidateCache = async ({ 
                                        product,
                                        order,
                                        admin,
                                        userId,
                                        orderId,
                                        productId
                                      }: InvalidateCacheProps)=> {
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

         nodeCache.del(productKeys);
    }
    if(order) {
        const orderKeys: string[] = ["all-orders", `myorders_${userId}`, `order-${orderId}`];

        nodeCache.del(orderKeys)
    }
                                      } 
