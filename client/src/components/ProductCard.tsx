
import { FaPlus } from 'react-icons/fa';

type ProductsProps = {
    productId: string;
    photos: {url: string}[]; //means photos is an array and it has an object with a key url
    name: string;
    price: number;
    stock: number;
    handler: () => void;
}

const ProductCard = (
    {
    productId,
    photos,
    name,
    price,
    stock,
    handler
    }: ProductsProps) => {
  return (
    <>
    <div className='productcard'>
    <img src={photos[1]?.url} alt={name} />
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