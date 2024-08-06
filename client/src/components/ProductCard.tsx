
import { FaPlus } from 'react-icons/fa';

type ProductsProps = {
    productId: string;
    photo: string;
    name: string;
    price: number;
    stock: number;
    handler: () => void;
}

const server = "abcdefgh"

const ProductCard = (
    {
    productId,
    photo,
    name,
    price,
    stock,
    handler
    }: ProductsProps) => {
  return (
    <>
    <div className='productcard'>
    <img src={photo}alt={name} />
    {/* <img src={`${server}/${photo}` }alt={name} /> */}
    <p>{name}</p>
    <span>₹{price}</span>
    <div>
        <button onClick={()=>handler()}><FaPlus /></button>
    </div>
    </div>
    </>
  )
}

export default ProductCard