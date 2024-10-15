import AdminSidebar from '../../../components/admin/AdminSidebar'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'
import { UserReducerInitialState } from '../../../types/reducer-types'
import { useSelector } from 'react-redux'
import { useAllOrdersQuery, useDeleteOrderMutation, useOrderDetailsQuery, useUpdateOrderMutation } from '../../../redux/api/orderAPI'
import { responseToast } from '../../../utils/features'
import { OrderItem } from '../../../types/types'

const defaultData = {
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    phoneno: "",
    landmark: "",
    addresstype: ""
  },
  status: "",
  subtotal: 0,
  discount: 0,
  shippingcharges: 0,
  tax: 0,
  total: 0,
  orderItems: [],
  user: { name: "", _id: "" },
  _id: ""
};

const TransactionManagement = () => {

  const { user }  = useSelector((state: {userReducer: UserReducerInitialState}) => state.userReducer);

  const params = useParams();

  const navigate = useNavigate();

  const { data, isError } = useOrderDetailsQuery(params.id!);

  console.log(data?.data.order);

  const {
    status,
    subtotal,
    discount,
    shippingcharges,
    tax,
    total,
    orderItems,
    user: { name },
    shippingInfo: { address, city, state, country, pinCode }

  } = data?.data.order || defaultData;
  

  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const { refetch: refetchOrders } = useAllOrdersQuery(user?._id!);

const updateHandler = async () => {
  const res = await updateOrder({
    userId: user?._id!,
    orderId: data?.data.order._id!
  });
  responseToast(res, navigate, "/admin/transaction");
  refetchOrders();
};

const deleteHandler = async () => {
  const res = await deleteOrder({
    userId: user?._id!,
    orderId: data?.data.order._id!
  });
  responseToast(res, navigate, "/admin/transaction"); 
};

if (isError) return <Navigate to={"/404"} />;

  return (
    <>
    <div className="admin-container">
      <AdminSidebar />
      <main className='product-management'>
        <section>
        <h2>Order Items</h2>
        {
         orderItems.map((i: any) => (
          <ProductCard
          key={i._id}
          name={i.name}
          mainPhoto={i.mainPhoto}
          price={i.price}
          quantity={i.quantity}
          _id={i._id}
          productId={i.productId}
          />
         ))}
        </section>
        <article className="shipping-info-card">
        <button onClick={deleteHandler} className="product-delete-btn">
                <FaTrash />
              </button>
        <h1>Order Info</h1>
        <h5>User Info</h5>
        <p>Name: {name}</p>
        <p>Address: {`${address}, ${city}, ${state}, ${country}, ${pinCode}`}</p>
        <h5>Amount Info</h5>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Discount: ₹{discount}</p>
        <p>Shipping Charge: ₹{shippingcharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>Total: ₹{total}</p>
        <h5>Status Info</h5>
        <p>
                Status:{" "}
                <span
                  className={
                    status === "Delivered"
                      ? "purple"
                      : status === "Shipped"
                      ? "green"
                      : "red"
                  }
                >
                  {status}
                </span>
              </p>
        <button className="shipping-btn" onClick={updateHandler}>
                Process Status
              </button>
        </article>
      </main>
    </div>
    </>
  )
}


const ProductCard = ({
  name,
  mainPhoto,
  price,
  quantity,
  productId,
}: OrderItem) => (
  <div className="transaction-product-card">
    <img src={mainPhoto} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement