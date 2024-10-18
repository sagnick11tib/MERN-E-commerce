import { Coupon } from "../models/coupon.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { stripe } from "../config/stripe.js";
import { razorInstance } from "../index.js";
import crypto from 'crypto';
import { Product } from "../models/product.models.js";
import { TempOrder } from "../models/tempOrder.models.js";
import { Order } from "../models/order.models.js";

export const RazorpayPaymentInit = asyncHandler(async (req, res) => {
    const { _id } = req.query;
    const { items, shippingInfo, tax, subtotal, discount, shippingCharges, total } = req.body;

    if (!items) throw new ApiError(400, "Items are required");

    // Generate random ID
    const randomId = crypto.randomBytes(16).toString('hex');

    const options = {
        amount: total * 100, // Razorpay expects the amount in paise
        currency: "INR",
        receipt: `order_rcptid_${Math.random().toString(36).substring(2, 9)}`,
        notes: {
            customOrderId: randomId, // Pass custom random ID
        },
    };

    console.log("BEFORE WALA", randomId);

    razorInstance.orders.create(options, async (err, order) => {
        if (err) {
            return res.status(500).json({ message: "Something went wrong" });
        }

        // Create TempOrder with customOrderId
        await TempOrder.create({
            shippingInfo,
            cartItems: items,
            user: _id,
            paymentId: order.id, // Save this Razorpay order ID
            total,
            customOrderId: randomId, // Store the custom random ID for matching,
            subtotal,
                tax,
                discount,
                shippingCharges,
        });

        return res.status(200).json({
            success: true,
            order,
            message: "Order created successfully",
        });
    });
});

export const getKey = asyncHandler(async (req,res)=> {
    const key = process.env.RAZORPAY_API_KEY;
    return res.status(200).json({
        success: true,
        key,
    })

});



export const paymentVerification = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET || "")
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        try {
            // Fetch Razorpay order to get the custom random ID
            const razorpayOrder = await razorInstance.orders.fetch(razorpay_order_id);
            const customOrderId = razorpayOrder?.notes!.customOrderId; // Get your custom ID
            console.log("VERIFY WALA = ",customOrderId);

            // Use the custom ID to find TempOrder
            const tempOrderDetails = await TempOrder.findOne({ customOrderId });
            if (!tempOrderDetails) {
                throw new ApiError(404, "TempOrder not found");
            }

            // Create Order
            const newOrder = await Order.create({
                shippingInfo: tempOrderDetails.shippingInfo,
                user: tempOrderDetails.user,
                paymentId: razorpay_payment_id,
                total: tempOrderDetails.total,
                orderItems: tempOrderDetails.cartItems,
                subtotal: tempOrderDetails.subtotal,
                tax: tempOrderDetails.tax,
                discount: tempOrderDetails.discount,
                shippingCharges: tempOrderDetails.shippingCharges,
                status: "Processing",
            });

            if (!newOrder) {
                throw new ApiError(400, "Failed to create the order. Please try again.");
            }

            // Update product stock
            tempOrderDetails.cartItems.forEach(async (item: any) => {
            
                const product = await Product.findById(item.productId);

                if (product) {
                    product.stock -= item.quantity;
                    await product.save();
                }
            });

            res.redirect(
                `http://localhost:5173/payment/success?reference=${razorpay_payment_id}`
            );

            //DELETE TEMPORDER AFTER SUCCESSFUL PAYMENT
            await TempOrder.deleteOne({ customOrderId })

        } catch (error) {
            console.error("Error finding TempOrder:", error);
            throw new ApiError(500, "Failed to find the TempOrder. Please try again.");
        }
    } else {
        res.status(400).json({
            success: false,
            message: "Payment verification failed. Please try again.",
        });
    }
});




const createPaymentIntentStripe = asyncHandler(async (req, res)=>{
    
    const { amount } = req.body;
    

    if(!amount) throw new ApiError(400, "Amount is required");

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: "inr"
    });

    return res
               .status(201)
               .json(new ApiResponse(201, { clientSecret: paymentIntent.client_secret }, "Payment intent created successfully"));

});
const newCoupon = asyncHandler(async (req, res)=>{

    const { coupon, amount } = req.body;

    if( !coupon || !amount) throw new ApiError(400, "Coupon code and amount is required");

    const createdCoupon = await Coupon.create({ code: coupon, amount});

    return res.status(201).json(new ApiResponse(201, { createdCoupon },`Coupon ${createdCoupon.code} created successfully`));
});
const applyDiscount = asyncHandler(async (req, res)=>{

    const { coupon } = req.query;

    if(!coupon) throw new ApiError(400, "Coupon code is required");

    const discount = await Coupon.findOne({ code: coupon });

    if(!discount) throw new ApiError(400, "Invalid coupon code");

    return res.status(200).json(new ApiResponse(200, { discount }, `Coupon ${discount.code} applied successfully`));

});
const allCoupons = asyncHandler(async (req, res)=>{

    const coupon = await Coupon.find({});

    if(!coupon) throw new ApiError(404, "No coupons found");

    return res.status(200).json(new ApiResponse(200, { coupon }, `All coupons fetched successfully`));

});
const getCoupon = asyncHandler(async (req, res)=>{

    const { id } = req.params;

    if(!id) throw new ApiError(400, "Coupon ID is required");

    const coupon = await Coupon.findById(id);

    if(!coupon) throw new ApiError(404, "Coupon not found");

    return res.status(200).json(new ApiResponse(200, { coupon }, `Coupon ${coupon.code} fetched successfully`));
});
const updateCoupon = asyncHandler(async (req, res)=>{

    const { id } = req.params;

    const { coupon, amount } = req.body;

    if(!id || !coupon || !amount) throw new ApiError(400, "Coupon ID, code and amount is required");

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, { code: coupon, amount }, { new: true });

    if(!updatedCoupon) throw new ApiError(400, "Coupon not updated");

    return res.status(200).json(new ApiResponse(200, { updatedCoupon }, `Coupon ${updatedCoupon.code} updated successfully`));
});
const deleteCoupon = asyncHandler(async (req, res)=>{

    const { id } = req.params;

    if(!id) throw new ApiError(400, "Coupon ID is required");

    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if(!deletedCoupon) throw new ApiError(400, "Coupon not deleted");

    return res.status(200).json(new ApiResponse(200, {} , `Coupon ${deletedCoupon.code} deleted successfully`));

});

export { createPaymentIntentStripe, newCoupon, applyDiscount, allCoupons, getCoupon, updateCoupon, deleteCoupon };