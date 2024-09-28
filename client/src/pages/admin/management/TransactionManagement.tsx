
import { useState } from 'react'
import AdminSidebar from '../../../components/admin/AdminSidebar'
import { OrderItemType, OrderType } from '../../../types'
import { Link } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'



const image: string = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const orderItems: OrderItemType[] = [
  {
    name: "Puma Shoes",
    photo: image,
    price: 1000,
    quantity: 1,
    _id: "1"
  },
  {
    name: "Puma Shoes",
    photo: image,
    price: 1000,
    quantity: 1,
    _id: "1"
  },
  {
    name: "Puma Shoes",
    photo: image,
    price: 1000,
    quantity: 1,
    _id: "1"
  },
  {
    name: "Puma Shoes",
    photo: image,
    price: 1000,
    quantity: 1,
    _id: "1"
  },
]




const TransactionManagement = () => {

  const [ order, setOrder ] = useState<OrderType>(
    {
    name: "John Doe",
    address: "123, Main Street",
    city: "New York",
    country: "USA",
    state: "New York",
    pinCode: 123456,
    status: "Processing",
    subtotal: 1000,
    discount: 20,
    shippingCharge: 100,
    tax: 10,
    total: 1000 + 100 - 20 + 10,
    orderItems: orderItems,
    _id: "hfhdifhh155"
    }
);

const { name, address, city, country, state, pinCode, subtotal, shippingCharge, tax, discount, total, status } = order;

const updateHandler = () => {
  setOrder(prev => ({
    ...prev,
    status: prev.status === "Processing" ? "Shipped" : "Delivered"
}));
};

  return (
    <>
    <div className="admin-container">
      <AdminSidebar />
      <main className='product-management'>
        <section>
        <h2>Order Items</h2>
        {
          order.orderItems.map(i=>(
            <ProductCard 
              name={i.name}
              photo={i.photo}
              price={i.price}
              quantity={i.quantity}
              _id={i._id}
            />
          ))
        }
        </section>
        <article className="shipping-info-card">
        <button className="product-delete-btn">
                <FaTrash />
              </button>
        <h1>Order Info</h1>
        <h5>User Info</h5>
        <p>Name: {name}</p>
        <p>Address: {`${address}, ${city}, ${state}, ${country}, ${pinCode}`}</p>
        <h5>Amount Info</h5>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Discount: ₹{discount}</p>
        <p>Shipping Charge: ₹{shippingCharge}</p>
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
  photo,
  price,
  quantity,
  _id
}: OrderItemType) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${_id}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement