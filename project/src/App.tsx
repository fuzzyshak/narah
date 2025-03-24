import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { GymsClasses } from './pages/GymsClasses';
import { VendorRegistration } from './pages/VendorRegistration';
import { UserRegistration } from './pages/UserRegistration';
import { About } from './pages/About';
import { Terms } from './pages/Terms';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { Contact } from './pages/Contact';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { UserBookings } from './pages/UserBookings';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const isSupabaseConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Required</h1>
          <p className="text-gray-600 mb-4">
            Supabase configuration is missing. Please click the "Connect to Supabase" button in the top right corner to set up your database connection.
          </p>
          <div className="text-sm text-gray-500">
            This will automatically configure the necessary environment variables in your .env file.
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gyms" element={<GymsClasses />} />
                <Route path="/vendors" element={
                  <ProtectedRoute requiredPermission="canManageVenues">
                    <VendorRegistration />
                  </ProtectedRoute>
                } />
                <Route path="/register" element={<UserRegistration />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/about" element={<About />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/bookings" element={
                  <ProtectedRoute>
                    <UserBookings />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;