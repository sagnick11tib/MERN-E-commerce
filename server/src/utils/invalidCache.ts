import { nodeCache } from "../app.js";
import { Product } from "../models/product.models.js";
import { InvalidateCacheProps } from "../types/types.js"

export const invalidateCache = async ({ 
                                        product,
                                        order,
                                        admin
                                      }: InvalidateCacheProps)=> {
    if(product) {
        const productKeys : string[] = [ 
            "latest-products", 
            "categories", 
            "all-products"
         ];
        
         const products = await Product.find({}).select("_id"); // get all products id to delete them from cache// [ { _id: 1 }, { _id: 2 }, { _id: 3 } ]

            products.forEach((product) => { // push all products id to productKeys array // [ "latest-products", "categories", "all-products", "product-1", "product-2", "product-3" ]
                productKeys.push(`product-${product._id}`);
            });

        nodeCache.del(productKeys);
    }
                                      } 
