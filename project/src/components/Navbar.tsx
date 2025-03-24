import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Building2, User, ShoppingCart, Menu, X, Calendar } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { items } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="border-b py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Dumbbell className="text-purple-600 w-6 h-6 transform -rotate-45" />
          <span className="text-xl font-bold">Narah</span>
        </Link>
        
        <button 
          className="md:hidden text-gray-600 hover:text-gray-900"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/gyms" className="text-gray-600 hover:text-gray-900">Gyms & Classes</Link>
          <Link to="/vendors" className="text-gray-600 hover:text-gray-900 flex items-center">
            <Building2 className="w-5 h-5 mr-1" />
            Vendors
          </Link>
          <Link to="/cart" className="text-gray-600 hover:text-gray-900 flex items-center relative">
            <ShoppingCart className="w-5 h-5 mr-1" />
            <span>Shopping Cart</span>
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <User className="w-5 h-5" />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                {user ? (
                  <>
                    <Link
                      to="/bookings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      My Bookings
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Sign In / Sign Up
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-white absolute z-50 left-0 right-0 shadow-md border-b">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <Link 
              to="/gyms" 
              className="block text-gray-600 hover:text-gray-900 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Gyms & Classes
            </Link>
            <Link 
              to="/vendors" 
              className="block text-gray-600 hover:text-gray-900 py-2 flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Building2 className="w-5 h-5 mr-1" />
              Vendors
            </Link>
            <Link 
              to="/cart" 
              className="block text-gray-600 hover:text-gray-900 py-2 flex items-center relative"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingCart className="w-5 h-5 mr-1" />
              <span>Shopping Cart</span>
              {items.length > 0 && (
                <span className="ml-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
            {user ? (
              <>
                <Link 
                  to="/bookings"
                  className="block text-gray-600 hover:text-gray-900 py-2 flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Calendar className="w-5 h-5 mr-1" />
                  My Bookings
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-600 hover:text-gray-900 py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/register" 
                className="block text-gray-600 hover:text-gray-900 py-2 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-5 h-5 mr-1" />
                <span>Sign In / Sign Up</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}