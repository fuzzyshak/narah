import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Image as ImageIcon, ChevronLeft, ChevronRight, Star, Calendar, Clock, X, Search } from 'lucide-react';
import { ImageGallery } from '../components/ImageGallery';
import { useCart } from '../context/CartContext';
import { SEO } from '../components/SEO';

interface GymCard {
  id: string;
  name: string;
  description: string;
  location: string;
  prices?: {
    name: string;
    description: string;
    price: string;
  }[];
  image: string;
  gallery?: string[];
  rating?: number;
  price?: string;
}

interface BookingDetails {
  date: string;
  time: string;
}

const ITEMS_PER_PAGE = 6;

const formatDate = (dateString: string) => {
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }
  return dateString;
};

function BookingModal({ 
  onClose, 
  onConfirm,
  gymName,
  selectedPass,
  passPrice
}: { 
  onClose: () => void;
  onConfirm: (booking: BookingDetails) => void;
  gymName: string;
  selectedPass: string;
  passPrice: string;
}) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [dateInputValue, setDateInputValue] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = (8 + i).toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm({ date: selectedDate, time: selectedTime });
      onClose();
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInputValue(value);
    
    if (value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = value.split('/');
      setSelectedDate(`${year}-${month}-${day}`);
    } else {
      setSelectedDate('');
    }
  };

  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = value.split('-');
      setDateInputValue(`${day}/${month}/${year}`);
      setSelectedDate(value);
      setShowDatePicker(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Book Your Session</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-purple-50 p-3 rounded-md mb-4">
            <p className="text-sm text-purple-700 font-medium">{gymName}</p>
            <p className="text-sm text-purple-700">{selectedPass} - {passPrice}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Date (dd/mm/yyyy)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                value={dateInputValue}
                onChange={handleDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Calendar 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" 
                onClick={() => setShowDatePicker(true)}
              />
              {showDatePicker && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                  <div className="p-2">
                    <input 
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      min={new Date().toISOString().split('T')[0]}
                      onChange={handleDatePickerChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Time
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    selectedTime === time
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {selectedDate && selectedTime && (
            <div className="bg-purple-50 p-3 rounded-md">
              <p className="text-sm text-purple-700">
                Selected: {dateInputValue} at {selectedTime}
              </p>
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Confirm & Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function GymCard({ gym }: { gym: GymCard }) {
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedPass, setSelectedPass] = useState<string>('');
  const [selectedPassPrice, setSelectedPassPrice] = useState<string>('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const { addItem } = useCart();

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gym.gallery && !isAnimating) {
      setDirection('left');
      setIsAnimating(true);
      setCurrentImageIndex((prev) => (prev - 1 + gym.gallery!.length) % gym.gallery!.length);
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gym.gallery && !isAnimating) {
      setDirection('right');
      setIsAnimating(true);
      setCurrentImageIndex((prev) => (prev + 1) % gym.gallery!.length);
    }
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setDirection(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const getSlideClass = () => {
    if (!direction) return '';
    if (direction === 'right') return 'animate-slide-left';
    return 'animate-slide-right';
  };

  const formatDescription = (description: string) => {
    return description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  const handlePassSelection = (passName: string, passPrice: string) => {
    if (selectedPass === passName) {
      setSelectedPass('');
      setSelectedPassPrice('');
    } else {
      setSelectedPass(passName);
      setSelectedPassPrice(passPrice);
    }
  };

  const handleBookingConfirm = (booking: BookingDetails) => {
    setBookingDetails(booking);
    
    addItem({
      id: '',
      gymId: gym.id,
      gymName: gym.name,
      passName: selectedPass,
      passPrice: selectedPassPrice,
      date: booking.date,
      time: booking.time,
      location: gym.location
    });
  };

  const showComingSoon = gym.name === 'Wyndham Grand Bahrain Bay' || 
                        gym.name === 'Grand Swiss-Belhotel Waterfront' || 
                        gym.name === 'Vida Beach Hotel' || 
                        gym.name === 'Barry\'s Fitness' ||
                        gym.name === 'Elite Resort & Spa';

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative group overflow-hidden">
        <img 
          src={gym.gallery ? gym.gallery[currentImageIndex] : gym.image} 
          alt={gym.name} 
          className={`w-full h-64 object-cover ${getSlideClass()}`}
        />
        {gym.gallery && (
          <>
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70 disabled:opacity-50"
              disabled={isAnimating}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70 disabled:opacity-50"
              disabled={isAnimating}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowGallery(true)}
              className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-opacity"
            >
              <ImageIcon className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold">{gym.name}</h3>
          {gym.rating && (
            <div className="flex items-center">
              {Array.from({ length: gym.rating }).map((_, index) => (
                <Star key={index} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          )}
        </div>
        <p 
          className="text-gray-600 mb-4 whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: formatDescription(gym.description) }}
        />
        <div className="space-y-4">
          {gym.prices && (
            <div className="space-y-4">
              <div className="space-y-2">
                {gym.prices.map((price) => (
                  <div 
                    key={price.name}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handlePassSelection(price.name, price.price)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${selectedPass === price.name ? 'border-purple-600 bg-purple-600' : 'border-gray-400'}`} />
                      <div>
                        <span className="font-medium text-sm">{price.name}</span>
                        <span className="text-gray-500 text-xs ml-1">{price.description}</span>
                      </div>
                    </div>
                    <span className="text-purple-600 font-semibold text-sm">{price.price}</span>
                  </div>
                ))}
              </div>
              
              {selectedPass && (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Now
                  </button>
                  
                  {bookingDetails && (
                    <div className="bg-purple-50 p-3 rounded-md">
                      <p className="text-sm text-purple-700">
                        Added to cart: {formatDate(bookingDetails.date)} at {bookingDetails.time}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="space-y-2">
            <div className="flex items-center text-gray-500 justify-start text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{gym.location}</span>
            </div>
            {showComingSoon && (
              <div className="text-purple-600 text-sm font-semibold">Coming Soon</div>
            )}
          </div>
        </div>
      </div>
      {showGallery && gym.gallery && (
        <ImageGallery
          images={gym.gallery}
          onClose={() => setShowGallery(false)}
        />
      )}
      {showBookingModal && (
        <BookingModal
          onClose={() => setShowBookingModal(false)}
          onConfirm={handleBookingConfirm}
          gymName={gym.name}
          selectedPass={selectedPass}
          passPrice={selectedPassPrice}
        />
      )}
    </div>
  );
}

const gyms: GymCard[] = [
  {
    id: '1',
    name: 'Diplomat Radisson Blu',
    description: '• Five-star hotel featuring a large swimming pool\n• Expansive gym with **TechnoGym** equipment\n• Dedicated free weights area\n• Experience luxury fitness in the heart of the city\n• **Free parking** available in front of hotel or in the tower\n• Last booking at 19:00 - Gym hrs 9am to 10pm',
    location: 'Located in Manama',
    prices: [
      { name: 'Gym Pass', description: '(Gym Only)', price: 'BD 11.000' },
      { name: 'Pool Pass', description: '(Pool Only)', price: 'BD 11.000' },
      { name: 'All Pass', description: '(Gym/Pool)', price: 'BD 17.000' }
    ],
    image: 'https://i.ibb.co/8DXY14M8/Gym1.jpg',
    gallery: [
      'https://i.ibb.co/8DXY14M8/Gym1.jpg',
      'https://i.ibb.co/7tpJ3YmR/Pool1.jpg',
      'https://i.ibb.co/SDv1Z9sB/pool2.jpg',
      'https://i.ibb.co/bj5JRtzW/pool3.jpg',
      'https://i.ibb.co/qMhft3ys/pool4.jpg',
      'https://i.ibb.co/49SzP5N/Techno-Gym1.png'
    ],
    rating: 5
  },
  {
    id: '2',
    name: 'Vida Beach Hotel',
    description: '• Five-star beachfront hotel with infinity pool\n• State-of-the-art **Technogym** equipment\n• Panoramic sea views from the gym\n• Luxury spa and wellness center\n• **Free parking** available\n• Operating hours: 6am to 11pm daily\n• **Kids play area** available with supervision\n• beach access included with pool pass\n• All Pass options include Pool, Beach and Gym access\n• <span class="text-sm">Family Pass - 2 adults and 2 kids</span>',
    location: 'Located in Diyarr Muharraq',
    prices: [
      { name: 'Adult Pass', description: '(Pool, Beach & Gym)', price: 'BD 20.000' },
      { name: 'Kids Pass', description: '(Pool, Beach & Gym)', price: 'BD 10.000' },
      { name: 'Family Pass', description: '(Pool, Beach & Gym)', price: 'BD 40.000' }
    ],
    image: 'https://i.ibb.co/tMn4WfLR/beach.jpg',
    gallery: [
      'https://i.ibb.co/tMn4WfLR/beach.jpg',
      'https://i.ibb.co/k6QYdscc/Gym-technogym.jpg',
      'https://i.ibb.co/q3SNQwTp/kids-play.jpg',
      'https://i.ibb.co/rKgcHNg2/Kidsplay.jpg',
      'https://i.ibb.co/ZpgTXqhG/Pool.jpg',
      'https://i.ibb.co/b5419QS0/pool2.webp',
      'https://i.ibb.co/Y4z2mVsv/Pool3.jpg'
    ],
    rating: 5
  }
];

export function GymsClasses() {
  const [searchParams] = useSearchParams();
  const [showGallery, setShowGallery] = useState(false);
  const [selectedGym, setSelectedGym] = useState<GymCard | null>(null);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const filteredGyms = searchQuery
    ? gyms.filter(gym => 
        gym.name.toLowerCase().includes(searchQuery) ||
        gym.location.toLowerCase().includes(searchQuery) ||
        gym.description.toLowerCase().includes(searchQuery)
      )
    : gyms;

  return (
    <>
      <SEO 
        title="Gyms & Classes"
        description="Book fitness classes and gym sessions at Bahrain's premier facilities. Access top-rated gyms, hotel fitness centers, and wellness facilities."
        canonicalUrl="https://narah.com/gyms"
      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Gyms & Classes</h1>
            <form className="relative max-w-xl">
              <input
                type="text"
                placeholder="Search by name, location, or facilities..."
                defaultValue={searchQuery}
                onChange={(e) => {
                  const search = e.target.value;
                  if (search) {
                    searchParams.set('search', search);
                  } else {
                    searchParams.delete('search');
                  }
                }}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGyms.map((gym) => (
              <GymCard key={gym.id} gym={gym} />
            ))}
          </div>

          {filteredGyms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No gyms found matching your search criteria.</p>
              <button
                onClick={() => searchParams.delete('search')}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}