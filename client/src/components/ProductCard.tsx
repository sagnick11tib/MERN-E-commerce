
import { FaPlus } from 'react-icons/fa';

type ProductsProps = {
    productId: string;
    mainPhoto: {url: string}; //this means mainPhoto is an object with a url property
    subPhotos?: string[];
    name: string;
    price: number;
    stock: number;
    handler: () => void;
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
        <button onClick={()=>handler()}><FaPlus /></button>
    </div>
    </div>
    </>
  )
}

export default ProductCard