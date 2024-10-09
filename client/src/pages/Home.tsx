import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useLatestProductsQuery } from '../redux/api/productAPI';
import toast from 'react-hot-toast';
import  { Skeleton } from '../components/Loader';
import { CartItem } from '../types/types';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/reducer/cartReducer';

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");

  const dispatch = useDispatch();
  
  const addToCartHandler = (cartItem: CartItem) => {
   if (cartItem.stock < 1) return toast.error('Out of stock');
   dispatch(addToCart(cartItem));
   toast.success("Added to cart");
  };

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












