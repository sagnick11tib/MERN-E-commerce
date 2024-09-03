import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingBag, FaSignInAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';

const user = { _id: "", role: "admin" };

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const logoutHandler = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className="flex items-center justify-between p-4 bg-gray-800 text-white shadow-md">
        <div className="flex items-center gap-4 ml-auto">
          <Link onClick={() => setIsOpen(false)} to={"/"} className="hover:text-gray-400 mx-4">Home</Link>
          <Link onClick={() => setIsOpen(false)} to={"/search"} className="hover:text-gray-400 mx-4"><FaSearch /></Link>
          <Link onClick={() => setIsOpen(false)} to={"/cart"} className="hover:text-gray-400 mx-4"><FaShoppingBag /></Link>
          {user?._id ? (
            <>
              <button onClick={() => setIsOpen((prev) => !prev)} className="hover:text-gray-400 mx-4">
                <FaUser /> 
              </button>
              <dialog open={isOpen} className="absolute top-16 right-4 w-72 bg-white p-4 rounded-lg shadow-lg z-50">
                <div className="flex flex-col gap-2">
                  {user.role === "admin" && (
                    <Link to="/admin/dashboard" className="hover:text-gray-700">Admin</Link>
                  )}
                  <Link to="/orders" className="hover:text-gray-700">Orders</Link>
                  <button onClick={logoutHandler} className="flex items-center gap-2 hover:text-gray-700">
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </dialog>
            </>
          ) : (
            <Link to={"/login"} className="hover:text-gray-400 mx-4">
              <FaSignInAlt />
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;