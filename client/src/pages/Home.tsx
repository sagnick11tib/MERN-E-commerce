import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useLatestProductsQuery } from '../redux/api/productAPI';
import toast from 'react-hot-toast';
import Loader, { Skeleton } from '../components/Loader';

const Home = () => {
  
  const { data, isLoading, isError } = useLatestProductsQuery("");
  console.log(data)
  
  
  const addToCartHandler = ()=> {

  }

  if (isError) toast.error('Failed to fetch products');

  return (
    <>
      <div className='home'>
        <section>


        </section>
        <h1 className='flex justify-between items-center px-4 text-4xl font-serif'>
          <span>LATEST PRODUCTS</span>
          <Link to="/search" className='text-black-500 no-underline text-2xl font-serif'>MORE</Link>
        </h1>
        <main>
        {isLoading ? ( <Skeleton />):(data?.data?.latestProducts.map((i) => {
          // Ensure `photos` is an array of objects with `url`
          const photosArray = Array.isArray(i.photos) 
            ? i.photos // If photos is already an array, keep it
            : typeof i.photos === 'string' 
            ? [{ url: i.photos }] // If photos is a string, wrap it in an array
            : []; // Otherwise, provide an empty array

          return (
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              handler={addToCartHandler}
              photos={photosArray}  // Pass the corrected photos array
            />
          );
        }))}
        </main>
      </div>
    </>
  );
};

export default Home;