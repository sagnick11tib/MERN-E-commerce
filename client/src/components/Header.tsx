import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingBag, FaSignInAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';
import { User } from '../types/types';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';

interface PropsType {
  user: User | null;
}

const Header = ({ user }: PropsType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <>
      <nav className='header'>
          <Link onClick={() => setIsOpen(false)} to={"/"}>Home</Link>
          <Link onClick={() => setIsOpen(false)} to={"/search"}>
            <FaSearch />
          </Link>
          <Link onClick={() => setIsOpen(false)} to={"/cart"}>
            <FaShoppingBag />
          </Link>
          {user?._id ? (
            <>
              <button onClick={() => setIsOpen((prev) => !prev)}>
                <FaUser />
              </button>
              <dialog open={isOpen}>
                <div>
                  {user.role === "admin" && (
                    <Link to="/admin/dashboard">Admin</Link>
                  )}
                  <Link to="/orders">Orders</Link>
                  <button onClick={logoutHandler}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </dialog>
            </>
          ) : (
            <Link to={"/login"}>
              <FaSignInAlt />
            </Link>
          )}
      </nav>
    </>
  );
};

export default Header;
