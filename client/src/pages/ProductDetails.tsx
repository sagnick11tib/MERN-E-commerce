
import { useDispatch, useSelector } from "react-redux";
import { useRating } from "6pp";
import { Navigate, useParams } from "react-router-dom"
import { RootState } from "../redux/store";
import { useProductDetailsQuery } from "../redux/api/productAPI";
import { MyntraCarousel } from "../components/MyntraCarousel";
import { Slider } from "../components/Slider";
import { useState } from "react";
import { Skeleton } from "../components/Loader";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import toast from "react-hot-toast";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";


const ProductDetails = () => {
  const params = useParams(); // ex- /localhost:3000/product/1234
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading, isError, data } = useProductDetailsQuery(params.id!);

  const [carouselOpen, setCarouselOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const decrement = () => setQuantity((prev) => prev -1);
  const increment = () => {
    if (data?.data?.product.stock === quantity)
      return toast.error(`Only ${data?.data?.product.stock} items left in stock`);
    setQuantity((prev) => prev + 1);
  };

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");

    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

 // i want to create an array where mainphoto and subphoto will be in the same array so that i can pass it to the slider component
 // Ensure imgArray combines the mainPhoto and subPhotos safely
 const imgArray = [
  data?.data?.product.mainPhoto,
  ...(Array.isArray(data?.data?.product.subPhotos) ? data.data.product.subPhotos : []),
                  ].filter(Boolean); // Filters out any null or undefined entries

  
  if (isError) return <Navigate to="/404" />;

  return (
    <div className="product-details">
      {
        isLoading ? (
          <ProductLoader />
        ): (
          <>
            <main>
              <section>
                <Slider
                  showThumbnails
                  onClick={() => setCarouselOpen(true)}
                  images = {imgArray.map((i: any) => i.url)}
                  />
              {carouselOpen && (
                <MyntraCarousel
                  NextButton={NextButton}
                  PrevButton={PrevButton}
                  setIsOpen={setCarouselOpen}
                  images={imgArray.map((i: any) => i.url)}
                />
              )}
              </section>
              <section>
                <code>{data?.data?.product.category}</code>
                <h1>{data?.data?.product.name}</h1>
                <h3>₹{data?.data?.product.price}</h3>
                <article>
                  <div>
                    <button onClick={decrement}>-</button>
                    <span>{quantity}</span>
                    <button onClick={increment}>+</button>
                  </div>
                  <button>
                    Add to Cart
                  </button>
                </article>
                <p>{data?.data?.product.description}</p>
              </section>
            </main>
          </>
        )
      }
    </div>
  )
}

const ProductLoader = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        border: "1px solid #f1f1f1",
        height: "80vh",
      }}
    >
      <section style={{ width: "100%", height: "100%" }}>
        <Skeleton
          width="100%"
          containerHeight="100%"
          height="100%"
          length={1}
        />
      </section>
      <section
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
          padding: "2rem",
        }}
      >
        <Skeleton width="40%" length={3} />
        <Skeleton width="50%" length={4} />
        <Skeleton width="100%" length={2} />
        <Skeleton width="100%" length={10} />
      </section>
    </div>
  );
};

const NextButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="carousel-btn">
    <FaArrowRightLong />
  </button>
);

const PrevButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="carousel-btn">
    <FaArrowLeftLong />
  </button>
);

export default ProductDetails