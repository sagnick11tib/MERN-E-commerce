import mongoose, { Schema } from "mongoose";


const productSchema = new Schema({
    //name,photo,price,stock,category,description,ratings,numOfReviews,
    name: {
        type: String,
        required:[true, "Please enter name"]
    },
    photos: [
        {
            public_id: {
                type: String,
                required: [true, "Please enter Public ID"],
            },
            url: {
                type: String,
                required: [true, "Please enter URL"],
            }
        }
           ],
    price: {
        type:Number,
        required:[true,"Plear enter Price"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter Stock"],
    },
    category: {
        type: String,
        required: [true, "Please enter Category"],
    },
    description: {
        type: String,
        required: [true, "Please enter Description"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
},{timestamps: true})

export const Product = mongoose.model("Product", productSchema);    