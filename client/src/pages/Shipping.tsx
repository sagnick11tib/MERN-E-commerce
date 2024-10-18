import { FormEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserReducerInitialState } from "../types/reducer-types";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import axios from "axios";
import { server } from "../redux/store";
import toast from "react-hot-toast";

type ShippingInfoTypes = {
  address: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  phoneno: number;
};

const Shipping = () => {

  const { user } = useSelector((state: { userReducer: UserReducerInitialState}) => state.userReducer);

  const { cartItems, subtotal, tax, discount, shippingCharges, total } = useSelector((state: any)=> state.cartReducer);
  
  console.log(subtotal, tax, discount, shippingCharges, total, cartItems);

   const navigate = useNavigate();
   const dispatch = useDispatch();


  const { register, handleSubmit, formState: { errors } } = useForm<ShippingInfoTypes>();
  
  const submitHandlerShipping: SubmitHandler<ShippingInfoTypes> = async (shippingData) => {

    dispatch(saveShippingInfo(shippingData));
    try {
        // Fetch the Razorpay key
        const { data: { key } } = await axios.get(`http://localhost:7000/api/v1/payment/key`);

        // Prepare cart items in the correct format
        const formattedCartItems = cartItems.map((item: any) => ({
            productId: item.productId,
            mainPhoto: item.mainPhoto,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            stock: item.stock,
        }));

        // Send request to create order
        const { data } = await axios.post(
            `${server}/api/v1/payment/create?_id=${user?._id!}`,
            {
                items: formattedCartItems, // Use formatted cart items
                shippingInfo: shippingData, // Pass the shipping info
                subtotal,
                tax,
                discount,
                shippingCharges,
                total
          
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );


        // Razorpay options
        const options = {
            key,
            amount: data.order.amount,
            currency: "INR",
            name: "Kishori Store",
            description: "Modern E-commerce Store",
            image: "https://cdn.tovp.org/wp-content/uploads/2012/08/radharani-1.jpg.webp",
            order_id: data.order.id,
            callback_url: `${server}/api/v1/payment/paymentVerification`,
            prefill: {
                name: user?.name || "Guest",
                email: user?.email || "guest@example.com",
                contact: shippingData.phoneno.toString(),
            },
            notes: {
                address: shippingData.address,
            },
            theme: {
                color: "#121212",
            },
        };

        // Open Razorpay
        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();

    } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
    }
};

 

  const GoBackHandler = () => {
    navigate("/cart");
  };

  useEffect(() => {
    if ( cartItems.length <= 0 ) return navigate("/cart");
  }, [cartItems]);

  return (
    <>
      <div className="shipping">
        <button className="back-btn" onClick={GoBackHandler}>
          <BiArrowBack />
          Back
        </button>
        <form onSubmit={handleSubmit(submitHandlerShipping)}>
          <h1>SHIPPING ADDRESS</h1>

        
            <input
              required
              type="text"
              placeholder="Address"
              {...register('address', { required: true })}
            />
            {errors.address && <span>This field is required</span>}
          

        
            <input
              required
              type="text"
              placeholder="City"
              {...register('city', { required: true })}
            />
            {errors.city && <span>This field is required</span>}
          

        
            <input
              required
              type="text"
              placeholder="State"
              {...register('state', { required: true })}
            />
            {errors.state && <span>This field is required</span>}
          

        
            <input
              required
              type="number"
              placeholder="PinCode"
              {...register('pinCode', { required: true })}
            />
            {errors.pinCode && <span>This field is required</span>}
          
            <input
              required
              type="number"
              placeholder="Phone Number"
              {...register('phoneno', { required: true })}  
            />
          
            <select
              required
              {...register('country', { required: true })}
            >
              <option value="">Choose Country</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
            </select>
            {errors.country && <span>This field is required</span>}
          

          <button type="submit">Pay Now</button>
        </form>
      </div>
    </>
  );
};

export default Shipping;
