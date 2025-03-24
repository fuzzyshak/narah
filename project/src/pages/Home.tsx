import React, { useState } from 'react';
import { Building2, Clock, CreditCard, Dumbbell, LogIn, Search, Mail, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gyms?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubscriptionSuccess(true);
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Narah - Book Gyms & Fitness Classes in Bahrain"
        description="Book fitness classes and gym sessions at Bahrain's premier facilities. Access hotel gyms, fitness centers, and wellness facilities with flexible scheduling and day passes."
        canonicalUrl="https://narah.com"
        keywords="Bahrain fitness centers, Bahrain fitness gyms, Bahrain hotel gyms, book a gym in Bahrain, fitness booking Bahrain, gym day pass Bahrain, hotel fitness centers Bahrain"
      />
      <div className="flex flex-col">
        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80"
              alt="Fitness background"
              className="w-full h-full object-cover brightness-50"
            />
          </div>
          <div className="relative container mx-auto px-4 py-16 md:py-32 text-center text-white">
            <div className="absolute top-4 right-4">
              <Link 
                to="/register" 
                className="inline-flex items-center bg-white text-purple-600 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base"
              >
                <LogIn className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Sign In / Sign Up</span>
                <span className="sm:hidden">Sign In</span>
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Transform Your Life Through
              <span className="block text-purple-400">Fitness</span>
            </h1>
            <p className="text-base md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
              Book fitness classes and gym sessions at Bahrain's premier facilities. Your journey to a healthier lifestyle starts here.
            </p>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <Link 
                  to="/gyms" 
                  className="bg-purple-600 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  Start Your Journey
                  <span className="ml-2">→</span>
                </Link>
                <Link 
                  to="/vendors" 
                  className="bg-white text-purple-600 px-4 py-2.5 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <Building2 className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  Register Your Venue
                </Link>
              </div>
              
              <form onSubmit={handleSearch} className="w-full max-w-2xl mt-4 md:mt-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for Hotel Gyms/Fitness Centers"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 md:px-6 md:py-4 rounded-full bg-white bg-opacity-20 backdrop-blur-sm text-white placeholder-white placeholder-opacity-75 border-2 border-white border-opacity-30 focus:outline-none focus:border-opacity-50 pr-10 md:pr-12 text-sm md:text-base"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-white opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <Search className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Premium Facilities */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Dumbbell className="w-10 h-10 md:w-12 md:h-12 text-purple-600 transform -rotate-45" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Premium Facilities</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Access to Bahrain's top-rated gyms and fitness centers
                </p>
              </div>

              {/* Flexible Scheduling */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Clock className="w-10 h-10 md:w-12 md:h-12 text-purple-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Flexible Scheduling</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Book sessions that fit your schedule with real-time availability
                </p>
              </div>

              {/* Easy Payments */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <CreditCard className="w-10 h-10 md:w-12 md:h-12 text-purple-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Easy Payments</h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Secure online payments in BHD for all your bookings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center mb-8">
              <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Stay Updated</h2>
              <p className="text-gray-600">
                Enter your email to receive updates on new gyms we add
              </p>
            </div>

            {subscriptionSuccess ? (
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 rounded-full p-2">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Thank you for subscribing!</h3>
                <p className="text-green-700">
                  You'll be the first to know about new gyms and exclusive offers.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}