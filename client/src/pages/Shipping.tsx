import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiArrowBack } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type ShippingInfoTypes = {
  address: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
};

const Shipping = () => {

  const { cartItems } = useSelector((state: any)=> state.cartReducer);







  const { register, handleSubmit, formState: { errors } } = useForm<ShippingInfoTypes>();
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    pinCode: '',
    country: ''
  });

  const onSubmit: SubmitHandler<ShippingInfoTypes> = (data) => {
    setShippingInfo(data);
    console.log(data);
  };

  const navigate = useNavigate();

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
        <form onSubmit={handleSubmit(onSubmit)}>
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




// import { useState } from "react";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { BiArrowBack } from "react-icons/bi";
// import { useNavigate } from "react-router-dom";

// type ShippingInfoTypes = {
//   address: string;
//   city: string;
//   state: string;
//   pinCode: string;
//   country: string;
// };



// const Shipping = () => {
//   const { register, handleSubmit, formState: { errors } } = useForm<ShippingInfoTypes>();
//   const [shippingInfo, setShippingInfo] = useState({
//     address: '',
//     city: '',
//     state: '',
//     pinCode: '',
//     country: ''
//   });

//   const onSubmit: SubmitHandler<ShippingInfoTypes> = (data) => {
//     setShippingInfo(data);
//     console.log(data);
//   };

//   const navigate = useNavigate();

// const GoBackHandler = () => {
//   //window.history.back(); //this will take us to the previous page
//   //navigate(-1); //this will also take us to the previous page
//   navigate("/cart"); //this will take us to the
// };

//   return (
//     <>
//       <div className="shipping p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
//         <button className="flex items-center text-blue-500 hover:text-blue-700 " onClick={GoBackHandler}>
//           <BiArrowBack className="mr-2" />
//           Back
//         </button>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <h1 className="text-2xl font-bold text-center">SHIPPING ADDRESS</h1>

//           <div>
//             <input
//               required
//               type="text"
//               placeholder="Address"
//               {...register('address', { required: true })}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {errors.address && <span className="text-red-500">This field is required</span>}
//           </div>

//           <div>
//             <input
//               required
//               type="text"
//               placeholder="City"
//               {...register('city', { required: true })}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {errors.city && <span className="text-red-500">This field is required</span>}
//           </div>

//           <div>
//             <input
//               required
//               type="text"
//               placeholder="State"
//               {...register('state', { required: true })}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {errors.state && <span className="text-red-500">This field is required</span>}
//           </div>

//           <div>
//             <input
//               required
//               type="number"
//               placeholder="PinCode"
//               {...register('pinCode', { required: true })}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {errors.pinCode && <span className="text-red-500">This field is required</span>}
//           </div>

//           <div>
//             <select
//               required
//               {...register('country', { required: true })}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Choose Country</option>
//               <option value="India">India</option>
//               <option value="USA">USA</option>
//               <option value="UK">UK</option>
//             </select>
//             {errors.country && <span className="text-red-500">This field is required</span>}
//           </div>

//           <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700">
//             Pay Now
//           </button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default Shipping;















// const Shipping = () => {
//   const [shippingInfo,setShippingInfo] = useState({
//     address: '',
//     city: '',
//     state: '',
//     pinCode: '',
//     country: ''
//   });

//   const changeHandler =(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
   
//     setShippingInfo(prev => ({...prev,[e.target.name]: e.target.value}));
//   };
   
//   return (
//    <>
//     <div className="shipping">
//     <button>
//         <BiArrowBack />
//       </button>
//       <form>
//         <h1>SHIPPING ADDRESS
//         </h1>

//         <input 
//         required
//         type="text" 
//         value={shippingInfo.address} 
//         placeholder="Address"
//         name="address" 
//         onChange={changeHandler}/>

//         <input 
//         required
//         type="text" 
//         value={shippingInfo.city} 
//         placeholder="City"
//         name="city" 
//         onChange={changeHandler}/>

//         <input 
//         required
//         type="text" 
//         value={shippingInfo.state} 
//         placeholder="State"
//         name="state" 
//         onChange={changeHandler}/>

//         <input 
//         required
//         type="number" 
//         value={shippingInfo.pinCode} 
//         placeholder="PinCode"
//         name="pinCode" 
//         onChange={changeHandler}/>

//         <select 
//         name="country" 
//         required 
//         value={shippingInfo.country} 
//         onChange={changeHandler}>

//             <option value="">Choose Country</option>
//             <option value="India">India</option>
//             <option value="USA">USA</option>
//             <option value="UK">UK</option>


//         </select>


//         <button type="submit">Pay Now</button>



        

//       </form>


//     </div>
      


//    </>
//   )
// }