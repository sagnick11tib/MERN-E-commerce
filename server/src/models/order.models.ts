import mongoose, { Schema } from "mongoose"

const oderSchema = new Schema(
    {
        shippingInfo: {
        address: {
            type: String,
            required: [true, "Please enter shipping address"],
        },
        city: {
            type: String,
            required: [true, "Please enter city"],
        },
        state: {
            type: String,
            required: [true, "Please enter state"],
        },
        country: {
            type: String,
            required: [true, "Please enter country"],
        },
        pinCode: {
            type: Number,
            required: [true, "Please enter pin code"],
        },
        phoneNo: {
            type: Number,
            required: [true, "Please enter phone number"],
        },
        landmark: {
            type: String,
            required: false,
        },
        addressType: {
            type: String,
            enum: ["Home", "Work"],
            default: "Home",
        }
    },
    user: {
        type: String,
        ref: "User",
        required: true,
    },
    subTotal: {
        type: Number,
        required: true,
        default: 0.0,
    },
    tax: {
        type: Number,
        required: true,
        default: 0.0,
    },
    shippingCharge: {
        type: Number,
        required: true,
        default: 0.0,
    },
    discount: {
        type: Number,
        required: true,
        default: 0.0,
    },
    total: {
        type: Number,
        required: true,
        default: 0.0,
    },
    status: {
        type: String,
        enum: ["Processing", "Shipped", "Delivered"],
        default: "Processing",
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true,
            },
            photo: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            }

        }
    ]
},{timestamps: true});

export const Order = mongoose.model("Order", oderSchema);