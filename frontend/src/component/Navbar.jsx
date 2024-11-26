import React from "react";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const Navbar = () => {
    const { user, logout } = useUserStore();
  const isAdmin = user?.role === "Admin";
  const cart = [];


  const logoutHandler = () => {
    logout();
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-95 backdrop-blur-md shadow-md z-40 border-b border-emerald-700">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        <Link to="/" className="flex items-center space-x-2 cursor-pointer">
          <h1 className="text-2xl font-bold text-emerald-400">Volt&Vogue</h1>
        </Link>

        <nav className="flex items-center space-x-4">
          <Link
            to="/"
            className="text-gray-300 hover:text-emerald-400 transition duration-200 ease-in-out"
          >
            Home
          </Link>

          {user && (
            <Link
              to="/cart"
              className="relative flex items-center text-gray-300 hover:text-emerald-400 transition duration-200 ease-in-out"
            >
              <ShoppingCart size={20} className="mr-1" />
              <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs">
                  {cart.length}
                </span>
              )}
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/secret-dashboard"
              className="flex items-center bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-200 ease-in-out"
            >
              <Lock size={18} className="mr-1" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}

          {user ? (
            <button
              onClick={logoutHandler}
              className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline ml-2">Log Out</span>
            </button>
          ) : (
            <>
              <Link
                to="/signup"
                className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out"
              >
                <UserPlus size={18} className="mr-2" />
                Sign Up
              </Link>
              <Link
                to="/login"
                className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out"
              >
                <LogIn size={18} className="mr-2" />
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
