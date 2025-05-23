import { useEffect, useState } from 'react'
import { VscError } from 'react-icons/vsc';
import { Link } from 'react-router-dom';
import CartItemCard from '../components/CartItem'
import { useDispatch, useSelector } from 'react-redux';
import { CartItem } from '../types/types';
import { addToCart, calculatePrice, discountApplied, removeCartItem, saveCoupon } from '../redux/reducer/cartReducer';
import axios from 'axios';
import { server } from '../redux/store';
import toast from 'react-hot-toast';
//    
//   {
//     productId: "1234",
//     name: "Product 1",
//     price: 2000,
//     quantity: 4,
//     mainPhoto: { url: "https://m.media-amazon.com/images/I/618d5bS2lUL._SX679_.jpg" },
//     stock:88
//   },
//   {
//     productId: "1234",
//     name: "Product 1",
//     price: 2000,
//     quantity: 4,
//     mainPhoto: {url: "https://m.media-amazon.com/images/I/618d5bS2lUL._SX679_.jpg" },
//     stock:88
//   }
// ];
// const Subtotal = 6000;
// const tax = Math.round(Subtotal * 0.18);
// const shippingCharges = 200;
// const discount = 400;
// const total = (Subtotal + tax + shippingCharges) - discount;

const Cart = () => {

  const { cartItems, subtotal, tax, total, shippingCharges, discount } = useSelector((state: any)=> state.cartReducer);

  const dispatch = useDispatch();

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItem) => {

    if ( cartItem.quantity >= cartItem.stock ) return; // If the quantity is greater than the stock then return

    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1}))

  };

  const decrementHandler = (cartItem: CartItem) => {
      
      if ( cartItem.quantity <= 1 ) return;
  
      dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1}))
  };

  const removeHandler = (productId: string) => {

    dispatch(removeCartItem(productId));
    toast.success("Item Removed from the Cart");

  };

  useEffect(()=> {

    const { token: cancelToken, cancel } = axios.CancelToken.source();
  
    const timeOutID = setTimeout(()=> {

      axios.get(`${server}/api/v1/payment/discount?coupon=${couponCode}`,{ cancelToken })
      .then((res) =>{
    
        dispatch(discountApplied(res.data.data.discount.amount));
        dispatch(saveCoupon(couponCode));
        setIsValidCouponCode(true);
        dispatch(calculatePrice());

      })
      .catch(() => {
        dispatch(discountApplied(0));
        setIsValidCouponCode(false);
        dispatch(calculatePrice());
      });
    },1000);
    return ()=> {
      clearTimeout(timeOutID);
      cancel();
      setIsValidCouponCode(false);
    }
  },[couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="cart">
      <main>
        {
            cartItems.length > 0 ? (cartItems.map((item: any,idx: any)=>{
              return <CartItemCard incrementHandler={incrementHandler} 
                                   decrementHandler={decrementHandler} 
                                   removeHandler={removeHandler} 
                                   key={idx} 
                                   AllCartItem={item} />
            })) : (<h1>No Items in the Cart</h1>)
        }
      </main>
      <aside>
        <p>Subtotal:₹{subtotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Discount:<em>- ₹{discount}</em> </p>
        <p><b>Total: ₹{total}</b></p>
        <input type="text" value={couponCode} onChange={(e)=> setCouponCode(e.target.value)} placeholder="Enter Coupon Code" />
        {
          couponCode && (isValidCouponCode? (<span className='green'>₹{discount} off using the <code>{couponCode}</code></span> ): (<span className='red' style={{color:"red"}}>Invalid Coupon Code <VscError /></span>))
        }
        {
          cartItems.length > 0 && <Link to="/shipping">Checkout</Link>
        }
      </aside>
    </div>
  )
}

export default Cart