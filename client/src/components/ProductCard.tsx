
import { FaExpandAlt, FaPlus } from 'react-icons/fa';
import { CartItem } from '../types/types';
import { Link } from 'react-router-dom';

type ProductsProps = {
    productId: string;
    mainPhoto: {url: string}; //this means mainPhoto is an object with a url property
    subPhotos?: string[];
    name: string;
    price: number;
    stock: number;
    handler: (cartItem: CartItem) => string | undefined;
}

const ProductCard = (
    {
    productId,
    mainPhoto,
    name,
    price,
    stock,
    handler
    }: ProductsProps) => {
  return (
    <>
    <div className='product-card'>
    <img src={mainPhoto.url} alt={name} />
    {/* <img src={`${server}/${photo}` }alt={name} /> */}
    <p>{name}</p>
    <span>₹{price}</span>
    <div>
        <button onClick={()=>handler({
            productId,
            mainPhoto: mainPhoto.url,
            name,
            price,
            quantity: 1,
            stock
        })}><FaPlus />
        </button>
        <button>
          <Link to={`/product/${productId}`}>
            <FaExpandAlt />
          </Link>
        </button>
    </div>
    </div>
    </>
  )
}

export default ProductCard