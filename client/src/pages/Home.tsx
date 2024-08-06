import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Home = () => {
  console.log('Home');


  const addToCartHandler = ()=> {

  }
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
          <ProductCard
                        productId='123456'
                        name='Macbook'
                        price={129999}
                        stock={20}
                        handler={addToCartHandler}
                        photo="https://m.media-amazon.com/images/I/618d5bS2lUL._SX679_.jpg"
           />
        </main>
      </div>
    </>
  );
};

export default Home;