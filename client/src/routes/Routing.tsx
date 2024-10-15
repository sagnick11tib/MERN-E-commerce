import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import LoaderLayout from "../components/Loader";
import { Toaster } from "react-hot-toast";
import {  useSelector } from "react-redux";
import { UserReducerInitialState } from "../types/reducer-types";
//import Header from "../components/Header";


const Home = lazy(()=> import("../pages/Home"));
const Search = lazy(()=> import("../pages/Search"));
const ProductDetails = lazy(()=> import("../pages/ProductDetails"));
const Cart = lazy(()=> import("../pages/Cart"));
const Login = lazy(()=> import("../pages/Login"));
const ProtectedRoute = lazy(()=> import("../components/ProtectedRoute"));
const Shipping = lazy(()=> import("../pages/Shipping"));
const Orders = lazy(()=> import("../pages/Orders"));
const OrderDetails = lazy(()=> import("../pages/OrderDetails"));
const Checkout = lazy(()=> import("../pages/Checkout"));

// Admin Pages
const Dashboard = lazy(()=> import("../pages/admin/Dashboard"));
const Products = lazy(()=> import("../pages/admin/Products"));
const Customers = lazy(()=> import("../pages/admin/Customers"));
const Transaction = lazy(()=> import("../pages/admin/Transaction"));
const Discount = lazy(()=> import("../pages/admin/Discount"));
// Charts
const Barcharts = lazy(()=> import("../pages/admin/charts/Barcharts"));
const Piecharts = lazy(()=> import("../pages/admin/charts/Piecharts"));
const Linecharts = lazy(()=> import("../pages/admin/charts/Linecharts"));
// Apps
const Coupon = lazy(()=> import("../pages/admin/apps/Coupon"));
const Stopwatch = lazy(()=> import("../pages/admin/apps/Stopwatch"));
const Toss = lazy(()=> import("../pages/admin/apps/Toss"));
// Management
const NewProduct = lazy(()=> import("../pages/admin/management/NewProduct"));
const ProductManagement = lazy(()=> import("../pages/admin/management/ProductManagement"));
const TransactionManagement = lazy(()=> import("../pages/admin/management/TransactionManagement"));
const NewDiscount = lazy(()=> import("../pages/admin/management/NewDiscount"));
const DiscountManagement = lazy(()=> import("../pages/admin/management/DiscountManagement"));
// Not Found
const NotFound = lazy(()=> import("../pages/NotFound"));

const Routing = ()=>{


 const { user } = useSelector((state: {userReducer :UserReducerInitialState})=> state.userReducer);
 //console.log(user)

    return (
      <>
       
        <Suspense fallback={<LoaderLayout />}>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<ProtectedRoute isAuthenticated={user ? false : true}><Login /></ProtectedRoute>} />
            {/* Logged In User Routes */}
            {/* <Route                element={<ProtectedRoute isAuthenticated={user ? true : false} /> } > */}
            <Route element={ <ProtectedRoute isAuthenticated = {user ? true : false} />}>
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/pay" element={<Checkout />} />
            </Route>
            {/* Admin Routes */}
            <Route 
             element={
              <ProtectedRoute
                isAuthenticated={true}
                adminOnly={true}
                admin={user?.role === "admin" ? true : false}
              />
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />
            <Route path="/admin/discount" element={<Discount />} />

            {/* Charts */}
            <Route path="/admin/chart/bar" element={<Barcharts />} />
            <Route path="/admin/chart/pie" element={<Piecharts />} />
            <Route path="/admin/chart/line" element={<Linecharts />} />
            {/* Apps */}
            <Route path="/admin/app/coupon" element={<Coupon />} />
            <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
            <Route path="/admin/app/toss" element={<Toss />} />

            {/* Management */}
            <Route path="/admin/product/new" element={<NewProduct />} />

            <Route path="/admin/product/:id" element={<ProductManagement />} />

            <Route
              path="/admin/transaction/:id"
              element={<TransactionManagement />}
            />

            <Route path="/admin/discount/new" element={<NewDiscount />} />

            <Route
              path="/admin/discount/:id"
              element={<DiscountManagement />}
            />
                </Route>

                <Route path="*" element={<NotFound />} />

                </Routes>  
                </Suspense>
                <Toaster position="bottom-center" />
                
                </>
    )
}

export default Routing;