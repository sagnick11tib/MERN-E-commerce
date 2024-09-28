import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useLatestProductsQuery } from '../redux/api/productAPI';
import toast from 'react-hot-toast';
import  { Skeleton } from '../components/Loader';

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");
  console.log(data);
  
  const addToCartHandler = () => {
    // Add to cart logic here
  }

  if (isError) {
    toast.error('Failed to fetch products');
  }

  return (
    <>
      <div className="home">
        <section>
          {/* You can add any content or banner here */}
        </section>

        <h1>
          LATEST PRODUCTS
          <Link to="/search" className="findmore">MORE</Link>
        </h1>

        <main>
          {isLoading ? (
            <Skeleton />
          ) : (
            data?.data?.latestProducts.map((i) => {
              // Ensure `photos` is an array of objects with `url`
              const photosArray = Array.isArray(i.photos)
                ? i.photos
                : typeof i.photos === 'string'
                ? [{ url: i.photos }]
                : [];

              return (
                <ProductCard
                  key={i._id}
                  productId={i._id}
                  name={i.name}
                  price={i.price}
                  stock={i.stock}
                  handler={addToCartHandler}
                  photos={photosArray}
                />
              );
            })
          )}
        </main>
      </div>
    </>
  );
};

export default Home;












