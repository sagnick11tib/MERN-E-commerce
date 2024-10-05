import { Coupon } from "../models/coupon.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { stripe } from "../config/stripe.js";


const createPaymentIntent = asyncHandler(async (req, res)=>{
    
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

export { createPaymentIntent, newCoupon, applyDiscount, allCoupons, getCoupon, updateCoupon, deleteCoupon };