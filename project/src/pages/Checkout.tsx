import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Building2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { SEO } from '../components/SEO';

export function Checkout() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'venue'>('card');
  const [error, setError] = useState('');

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.passPrice.replace('BD ', ''));
      return total + price;
    }, 0).toFixed(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Add each cart item to confirmed bookings
      for (const item of items) {
        const [year, month, day] = item.date.split('-');
        const bookingDate = `${year}-${month}-${day}`;

        const { error: bookingError } = await supabase
          .from('confirmed_bookings')
          .insert({
            user_id: user.id,
            gym_id: item.gymId,
            gym_name: item.gymName,
            pass_name: item.passName,
            pass_price: item.passPrice,
            booking_date: bookingDate,
            booking_time: item.time,
            location: item.location,
            payment_status: paymentMethod === 'card' ? 'paid' : 'pay at venue'
          });

        if (bookingError) throw bookingError;
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentComplete(true);
      
      // Clear cart after successful payment
      setTimeout(() => {
        clearCart();
        navigate('/bookings');
      }, 3000);
    } catch (error) {
      console.error('Payment/booking error:', error);
      setError('An error occurred while processing your booking. Please try again.');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link 
              to="/gyms" 
              className="inline-flex items-center justify-center bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
            >
              Browse Gyms & Classes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              {paymentMethod === 'card' 
                ? 'Your payment has been processed and your booking is confirmed.' 
                : 'Your booking is confirmed. Please pay at the venue.'}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              You will be redirected to your bookings page shortly...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Checkout"
        description="Complete your booking for fitness classes and gym sessions"
        canonicalUrl="https://narah.com/checkout"
      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/cart" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold mb-8">Checkout</h1>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="border-b pb-4">
                      <h3 className="font-medium">{item.gymName}</h3>
                      <p className="text-sm text-gray-600">{item.passName}</p>
                      <p className="text-purple-600 font-medium">{item.passPrice}</p>
                      <div className="text-sm text-gray-500 mt-1">
                        {item.date} at {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div 
                      className={`flex items-center justify-between p-4 rounded-lg cursor-pointer border-2 transition-colors ${
                        paymentMethod === 'card' 
                          ? 'border-purple-600 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-200'
                      }`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'card' ? 'border-purple-600' : 'border-gray-400'
                        }`}>
                          {paymentMethod === 'card' && (
                            <div className="w-3 h-3 rounded-full bg-purple-600" />
                          )}
                        </div>
                        <span className="ml-3">Pay Now with Card</span>
                      </div>
                      <CreditCard className={`w-5 h-5 ${
                        paymentMethod === 'card' ? 'text-purple-600' : 'text-gray-400'
                      }`} />
                    </div>

                    <div 
                      className={`flex items-center justify-between p-4 rounded-lg cursor-pointer border-2 transition-colors ${
                        paymentMethod === 'venue' 
                          ? 'border-purple-600 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-200'
                      }`}
                      onClick={() => setPaymentMethod('venue')}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'venue' ? 'border-purple-600' : 'border-gray-400'
                        }`}>
                          {paymentMethod === 'venue' && (
                            <div className="w-3 h-3 rounded-full bg-purple-600" />
                          )}
                        </div>
                        <span className="ml-3">Pay at Venue</span>
                      </div>
                      <Building2 className={`w-5 h-5 ${
                        paymentMethod === 'venue' ? 'text-purple-600' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">Total</span>
                      <span className="text-xl font-bold text-purple-600">BD {calculateTotal()}</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isProcessing ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        paymentMethod === 'card' ? 'Pay Now' : 'Confirm Booking'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}