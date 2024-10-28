
import { useDispatch, useSelector } from "react-redux";
import { useRating } from "6pp";
import { Navigate, useParams } from "react-router-dom"
import { RootState } from "../redux/store";
import { useAllReviewsOfProductQuery, useDeleteReviewMutation, useNewReviewMutation, useProductDetailsQuery } from "../redux/api/productAPI";
import { MyntraCarousel } from "../components/MyntraCarousel";
import { Slider } from "../components/Slider";
import { useRef, useState } from "react";
import { Skeleton } from "../components/Loader";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import toast from "react-hot-toast";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem, Review } from "../types/types";
import RatingComponents from "../components/Rating";
import { FiEdit } from "react-icons/fi";
import { responseToast } from "../utils/features";
import { FaRegStar, FaStar, FaTrash } from "react-icons/fa";


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

  const cartImagePhoto = data?.data?.product.mainPhoto.url;

  if (isError) return <Navigate to="/404" />;

  const reviewsResponse = useAllReviewsOfProductQuery(params.id!);

  const {
    Ratings: RatingsEditable,
    rating,
    setRating,
  } = useRating({
    IconFilled: <FaStar />,
    IconOutline: <FaRegStar />,
    value: 0,
    selectable: true,
    styles: {
      fontSize: "1.75rem",
      color: "coral",
      justifyContent: "flex-start",
    },
  });

  const [reviewComment, setReviewComment] = useState("");
  const reviewDialogRef = useRef<HTMLDialogElement>(null);
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);

  const [createReview] = useNewReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const showDialog = () => {
    reviewDialogRef.current?.showModal();
  };

  const reviewCloseHandler = () => {
    reviewDialogRef.current?.close();
    setRating(0);
    setReviewComment("");
  };

  const submitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReviewSubmitLoading(true);
    reviewCloseHandler();

    const res = await createReview({
      comment: reviewComment,
      rating,
      userId: user?._id,
      productId: params.id!,
    });

    setReviewSubmitLoading(false);

    responseToast(res, null, "");

    // API call to submit review
  };

  const handleDeleteReview = async (reviewId: string) => {
    const res = await deleteReview({ reviewId, userId: user?._id });
    responseToast(res, null, "");
  };



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
                <em  style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <RatingComponents value={data?.data?.product.ratings || 0} />({data?.data?.product.numOfReviews} Reviews)
                </em>
                <h3>₹{data?.data?.product.price}</h3>
                <article>
                  <div>
                    <button onClick={decrement}>-</button>
                    <span>{quantity}</span>
                    <button onClick={increment}>+</button>
                  </div>
                  <button
                  onClick={()=>
                    addToCartHandler({
                      productId: data?.data?.product._id || "",
                      mainPhoto: cartImagePhoto || "",
                      name: data?.data?.product.name || "",
                      price: data?.data?.product.price || 0,
                      quantity,
                      stock: data?.data?.product.stock || 0,

                    })
                  }
                  >
                    Add to Cart
                  </button>
                </article>
                <p>{data?.data?.product.description}</p>
              </section>
            </main>
          </>
        )
      }
      <dialog ref={reviewDialogRef} className="review-dialog">
        <button onClick={reviewCloseHandler}>X</button>
        <h2>Write a Review</h2>
        <form onSubmit={submitReview}>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Review..."
          ></textarea>
          <RatingsEditable />
          <button disabled={reviewSubmitLoading} type="submit">
            Submit
          </button>
        </form>
      </dialog>

      <section>
        <article>
          <h2>Reviews</h2>

          {reviewsResponse.isLoading
            ? null
            : user && (
                <button onClick={showDialog}>
                  <FiEdit />
                </button>
              )}
        </article>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            overflowX: "auto",
            padding: "2rem",
          }}
        >
          {reviewsResponse.isLoading ? (
            <>
              <Skeleton width="45rem" length={5} />
              <Skeleton width="45rem" length={5} />
              <Skeleton width="45rem" length={5} />
            </>
          ) : (
            reviewsResponse.data?.data.reviews.map((review) => (
              <ReviewCard
                handleDeleteReview={handleDeleteReview}
                userId={user?._id}
                key={review._id}
                review={review}
              />
            ))
          )}
        </div>
      </section>
    </div>
  )
}


const ReviewCard = ({
  review,
  userId,
  handleDeleteReview,
}: {
  userId?: string;
  review: Review;
  handleDeleteReview: (reviewId: string) => void;
}) => (
  <div className="review">
    <RatingComponents value={review.rating} />
    <p>{review.comment}</p>
    <div>
      <img src={review.user.photo} alt="User" />
      <small>{review.user.name}</small>
    </div>
    {userId === review.user._id && (
      <button onClick={() => handleDeleteReview(review._id)}>
        <FaTrash />
      </button>
    )}
  </div>
);


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