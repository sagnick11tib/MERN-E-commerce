import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartItem } from "../types/types";

type CartItemProps = {
    AllCartItem: {
        productId: string;
        name: string;
        price: number;
        quantity: number;
        mainPhoto: string ;
        stock: number;
    }
    incrementHandler: (cartItem: CartItem) => void;  
    decrementHandler: (cartItem: CartItem) => void;
    removeHandler: (productId: string) => void;
};

const CartItemShow = ({ AllCartItem, incrementHandler, decrementHandler, removeHandler }: CartItemProps) => {
    const { productId, name, price, quantity, mainPhoto } = AllCartItem;

  return (
    <div className="cart-item">
        <img src={mainPhoto} alt={name} /> 
        <article>
            <Link to={`/product/${productId}`}><h4>{name}</h4></Link>
            <span>₹{price}</span>
            </article> 

         <div>
            <button onClick={()=> decrementHandler(AllCartItem)}>-</button>
            <p>{quantity}</p>
            <button onClick={()=> incrementHandler(AllCartItem)}>+</button>
        </div>   

        <button onClick={()=> removeHandler(productId)}><FaTrash /></button>


    </div>
  )
}

export default CartItemShow