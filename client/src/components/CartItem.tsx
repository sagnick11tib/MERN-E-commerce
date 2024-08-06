import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

type CartItemProps = {
    AllCartItem: {
        productId: string;
        name: string;
        price: number;
        quantity: number;
        photo: string;
    }
};

const CartItem = ({ AllCartItem }: CartItemProps) => {
    const { productId, name, price, quantity, photo } = AllCartItem;

  return (
    <div className="cart-item">
        <img src={photo} alt={name} /> 
        <article>
            <Link to={`/product/${productId}`}><h4>{name}</h4></Link>
            <span>₹{price}</span>
            </article> 

         <div>
            <button>-</button>
            <p>{quantity}</p>
            <button>+</button>
        </div>   

        <button><FaTrash /></button>


    </div>
  )
}

export default CartItem