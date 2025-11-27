// components/Header.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext, useAuth } from '../contexts/AppContext';

const Header: React.FC = () => {
  const { cart } = useAppContext();
  const { isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const activeLinkClasses = "text-indigo-600 font-bold border-b-2 border-indigo-600";
  const defaultLinkClasses = "text-gray-700 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-600 transition-colors duration-200 ease-in-out";

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <NavLink to="/" className="text-2xl font-extrabold text-indigo-700 hover:text-indigo-900 transition-colors duration-200">
          SoleStride
        </NavLink>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 p-2 rounded-md"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              ></path>
            </svg>
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? activeLinkClasses : defaultLinkClasses)}
          >
            Shop
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) => `relative flex items-center ${isActive ? activeLinkClasses : defaultLinkClasses}`}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <span className="ml-1 hidden lg:inline">Cart</span>
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? activeLinkClasses : defaultLinkClasses)}
          >
            Admin
          </NavLink>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-2">
          <NavLink
            to="/"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Shop
          </NavLink>
          <NavLink
            to="/cart"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 relative"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Cart ({totalCartItems})
          </NavLink>
          <NavLink
            to="/admin"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Admin
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;