import { OrderItemType } from "../types/types.js";
import { Product } from "../models/product.models.js";
import { ApiError } from "./ApiError.js";
import mongoose, { Document } from "mongoose";
import { Review } from "../models/review.models.js";

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

export const getCategories = async  ({ categories, productsCount }: { categories: string[], productsCount: number})=> {

    const categoriesCountPromise = categories.map( category => Product.countDocuments({ category }) );

        const categoriesCount = await Promise.all(categoriesCountPromise);

        const categoryCount: Record<string, number>[] = [];
        // Record<string, number> is a type that defines an object with string keys and number values

        categories.forEach((category, index) => {
            categoryCount.push({
                [category]: Math.round((categoriesCount[index] / productsCount) * 100) //this will calculate the percentage of each category
            });//object with key as category and value as percentage of that category
        });

        return categoryCount;
}

interface MyDocument extends Document {
    createdAt: Date;
    discount?: number;
    total?: number;
}

// Define the FuncProps type for the function parameters
type FuncProps = {
    length: number;
    docArr: MyDocument[];
    today: Date;
    property?: "discount" | "total";
};

export const getChartData = ({
    length,
    docArr,
    today,
    property,
  }: FuncProps) => {
    const data: number[] = new Array(length).fill(0);
  
    docArr.forEach((i) => {
      const creationDate = i.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
  
      if (monthDiff < length) {
        if (property) {
          data[length - monthDiff - 1] += i[property]!;
        } else {
          data[length - monthDiff - 1] += 1;
        }
      }
    });
  
    return data;
  };




  export const findAverageRatings = async (
    productId: mongoose.Types.ObjectId
  ) => {
    let totalRating = 0;
  
    const reviews = await Review.find({ product: productId });
    reviews.forEach((review) => {
      totalRating += review.rating;
    });
  
    const averateRating = Math.floor(totalRating / reviews.length) || 0;
  
    return {
      numOfReviews: reviews.length,
      ratings: averateRating,
    };
  };




