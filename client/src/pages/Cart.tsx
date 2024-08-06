import { useEffect, useState } from 'react'
import { VscError } from 'react-icons/vsc';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem'
const cartItems = [
  {
    productId: "1234",
    name: "Product 1",
    price: 2000,
    quantity: 4,
    photo: "https://m.media-amazon.com/images/I/618d5bS2lUL._SX679_.jpg",
    stock:88
  }
];
const Subtotal = 6000;
const tax = Math.round(Subtotal * 0.18);
const shippingCharges = 200;
const discount = 400;
const total = (Subtotal + tax + shippingCharges) - discount;

const Cart = () => {
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  useEffect(()=> {
    const timeOutID = setTimeout(()=> {
      if(Math.random() > 0.5) setIsValidCouponCode(true) // Randomly setting the coupon code to be valid or invalid 0.5 is just a random number ex 
      else setIsValidCouponCode(false);
    },1000);
    return ()=> {
      clearTimeout(timeOutID);
      setIsValidCouponCode(false);
    }
  },[couponCode])

  return (
    <div>
      <main>
        {
            cartItems.length > 0 ? (cartItems.map((item,idx)=>{
              return <CartItem key={idx} AllCartItem={item} />
            })) : (<h1>No Items in the Cart</h1>)
        }
      </main>
      <aside>
        <p>Subtotal:₹{Subtotal}</p>
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