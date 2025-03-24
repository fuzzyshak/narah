import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { SEO } from '../components/SEO';

interface ConfirmedBooking {
  id: string;
  gym_id: string;
  gym_name: string;
  pass_name: string;
  pass_price: string;
  booking_date: string;
  booking_time: string;
  location: string;
  payment_status: string;
  created_at: string;
}

export function UserBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<ConfirmedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('confirmed_bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('booking_date', { ascending: true });

      if (error) throw error;

      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isUpcoming = (bookingDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(bookingDate);
    return date >= today;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(booking => isUpcoming(booking.booking_date));
  const pastBookings = bookings.filter(booking => !isUpcoming(booking.booking_date));

  return (
    <>
      <SEO 
        title="My Bookings"
        description="View and manage your gym and fitness class bookings"
        canonicalUrl="https://narah.com/bookings"
      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You don't have any confirmed bookings yet.</p>
                <Link 
                  to="/gyms" 
                  className="inline-flex items-center justify-center bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Browse Gyms & Classes
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {upcomingBookings.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Upcoming Bookings</h2>
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div 
                          key={booking.id} 
                          className="border rounded-lg p-4 hover:border-purple-200 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="mb-4 md:mb-0">
                              <h3 className="text-lg font-semibold mb-2">{booking.gym_name}</h3>
                              <p className="text-purple-600 font-medium mb-2">
                                {booking.pass_name} - {booking.pass_price}
                              </p>
                              <div className="space-y-1">
                                <div className="flex items-center text-gray-600">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  <span>{formatDate(booking.booking_date)}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Clock className="w-4 h-4 mr-2" />
                                  <span>{booking.booking_time}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  <span>{booking.location}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-start md:items-end">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                {booking.payment_status}
                              </span>
                              <span className="text-sm text-gray-500 mt-2">
                                Booked on {new Date(booking.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pastBookings.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Past Bookings</h2>
                    <div className="space-y-4">
                      {pastBookings.map((booking) => (
                        <div 
                          key={booking.id} 
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="mb-4 md:mb-0">
                              <h3 className="text-lg font-semibold mb-2">{booking.gym_name}</h3>
                              <p className="text-purple-600 font-medium mb-2">
                                {booking.pass_name} - {booking.pass_price}
                              </p>
                              <div className="space-y-1">
                                <div className="flex items-center text-gray-600">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  <span>{formatDate(booking.booking_date)}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Clock className="w-4 h-4 mr-2" />
                                  <span>{booking.booking_time}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  <span>{booking.location}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-start md:items-end">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                Completed
                              </span>
                              <span className="text-sm text-gray-500 mt-2">
                                Booked on {new Date(booking.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}