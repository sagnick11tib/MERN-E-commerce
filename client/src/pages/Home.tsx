import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useLatestProductsQuery } from '../redux/api/productAPI';
import toast from 'react-hot-toast';
import  { Skeleton } from '../components/Loader';

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");
  
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
            data?.data?.latestProducts.map((i : any) => {
             
              return (
                <ProductCard
                  key={i._id}
                  productId={i._id}
                  name={i.name}
                  price={i.price}
                  stock={i.stock}
                  handler={addToCartHandler}
                  mainPhoto={{ url: i.mainPhoto.url }}
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












