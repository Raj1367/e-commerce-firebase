import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { FaRegUserCircle } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { RootState } from '../ReduxToolkit/Store';
import LogoutButton from './LogoutButton';

const Navbar = () => {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Access cart items from Redux store
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Toggle sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Close sidebar when clicking on a menu item or outside
  const closeSidebar = () => setIsSidebarOpen(false);


  if (pathname !== "/login" && pathname !== "/signup") {
    return (
      <>
        {/* Navbar container with fixed positioning */}
        <div className="fixed top-0 left-0 w-full bg-black h-14 px-5 md:px-10 flex justify-between items-center z-50">
          <div className="text-white text-xl">
            <Link to="/"> <h3>E-commerce</h3></Link>
          </div>

          {/* Desktop Navbar */}
          <div className="hidden md:flex justify-center items-center gap-8 capitalize">

            {/* User Profile Dropdown */}
            <div className="relative">
              <div
                className="text-white text-md cursor-pointer"
                title="userprofile"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <FaRegUserCircle size={27} />
              </div>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-2 z-10">
                  <Link to="/userprofile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setIsProfileDropdownOpen(false)}>
                    User Profile
                  </Link>
                  <Link to="/myorders" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setIsProfileDropdownOpen(false)}>
                    My Orders
                  </Link>
                  <div className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"><LogoutButton /></div>
                </div>
              )}
            </div>

            {/* Cart Icon with Quantity Badge */}
            <Link to="/cart" className="relative">
              <div className="text-white text-md cursor-pointer" title="cart">
                <BsCart3 size={24} />
              </div>
              {cartQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {cartQuantity}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex md:hidden text-white cursor-pointer" onClick={toggleSidebar}>
            {isSidebarOpen ? <HiX size={30} /> : <HiOutlineMenuAlt3 size={30} />}
          </div>
        </div>

        {/* Sidebar for Mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 z-40 flex flex-col items-center pt-20 md:hidden"
            onClick={closeSidebar}  // Close sidebar when clicking outside the menu items
          >
            {/* Sidebar content */}
            <div className="flex flex-col items-center space-y-6 bg-black p-5 rounded-lg shadow-lg w-[350px]"
              onClick={(e) => e.stopPropagation()} // Prevents sidebar from closing when clicking inside
            >
              <Link to="/userprofile">
                <p className="text-white text-md cursor-pointer flex gap-2" onClick={closeSidebar}>
                  Profile
                </p>
              </Link>
              <Link to="/cart">
                <p className="text-white text-md cursor-pointer flex gap-2" onClick={closeSidebar}>
                  Cart
                </p>
              </Link>
             <div className="block px-4 py-2 text-white rounded-full cursor-pointer"><LogoutButton /></div>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export default Navbar;
