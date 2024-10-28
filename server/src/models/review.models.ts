
import mongoose, { Schema } from "mongoose";

const schema = new Schema(
    {
        comment: {
            type: String,
            maxlength: [200, "Comment must not be more than 200 characters"],
        },
        reviewPhotos: [
            {
                public_id: {
                    type: String,
                    required: [true, "Please enter Public ID"],
                },
                url: {
                    type: String,
                    required: [true, "Please enter URL"],
                },
            },
        ],
        rating: {
            type: Number,
            required: [true, "Please provide a rating"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating must not be more than 5"],
        },
        user: {
            type: String,
            ref: "User",
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        likedBy: [
            {
                type: String,
                ref: "User",
            },
            
        ]
    },
    { timestamps: true } 
)

export const Review = mongoose.model("Review", schema);

