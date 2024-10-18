import mongoose, { Schema } from 'mongoose';

const tempOrderSchema = new Schema(
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
      phoneno: {
        type: Number,
        required: [true, "Please enter phone number"],
      },
      landmark: {
        type: String,
        required: false,
      },
      addresstype: {
        type: String,
        enum: ["Home", "Work"],
        default: "Home",
      },
   },
   cartItems: [
    {
      name: {
        type: String,
        required: true,
      },
      mainPhoto: {
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
      },
      stock: {
        type: Number,
        required: true
      }
    },
  ],
  user: {
    type: String,
    ref: "User",
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  total:{
    type: Number,
    required: true,
  },
  customOrderId:{
    type: String,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
    default: 0.0, 
  },
  discount: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingCharges: {
    type: Number,
    required: true,
    default: 0.0,
  },
  subtotal: {
    type: Number,
    required: true,
    default: 0.0,
  },
},
{
    timestamps: true,
}
);

export const TempOrder = mongoose.model("TempOrder", tempOrderSchema);



// const tempOrder = new TempOrder({
//     razorpayOrderId: options.receipt,
//     items,
//     total,
//     userId: req.user.id, // Assuming user info is available in req
// });