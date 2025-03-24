import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Trash2, Calendar, Clock, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function Cart() {
  const { items, removeItem } = useCart();
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    // Convert from YYYY-MM-DD to DD/MM/YYYY
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.passPrice.replace('BD ', ''));
      return total + price;
    }, 0).toFixed(3);
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
          <div className="flex items-center justify-center mb-8">
            <ShoppingCart className="text-purple-600 w-8 h-8 mr-3" />
            <h1 className="text-2xl sm:text-3xl font-bold">Shopping Cart</h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Your cart is empty. Browse our selection of gyms and classes to add items to your cart.
              </p>
              <Link 
                to="/gyms" 
                className="inline-flex items-center justify-center bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
              >
                Browse Gyms & Classes
              </Link>
            </div>
          ) : (
            <div>
              <div className="border-b pb-4 mb-4 hidden md:grid md:grid-cols-5 text-sm font-medium text-gray-500">
                <div className="col-span-2">Booking Details</div>
                <div>Date & Time</div>
                <div>Price</div>
                <div></div>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="border-b pb-4 md:grid md:grid-cols-5 md:gap-4 md:items-center">
                    <div className="col-span-2 mb-2 md:mb-0">
                      <h3 className="font-medium">{item.gymName}</h3>
                      <p className="text-sm text-gray-600">{item.passName}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center mb-2 md:mb-0">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(item.date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-purple-600 font-medium mb-2 md:mb-0">
                      {item.passPrice}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold text-purple-600">BD {calculateTotal()}</span>
                </div>

                <div className="mt-6 flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0">
                  <Link 
                    to="/gyms" 
                    className="inline-flex items-center justify-center bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                  <button 
                    onClick={handleProceedToCheckout}
                    className="inline-flex items-center justify-center bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
            <p>
              Sign in / Sign up on the top right corner to save your bookings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}