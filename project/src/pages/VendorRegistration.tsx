import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Calendar } from 'lucide-react';

interface FormData {
  venueName: string;
  venueEmail: string;
  contactFirstName: string;
  contactLastName: string;
  venueType: string;
  facilityItem: string;
  facilityOptions: string[];
  otherFacilityOption: string;
  availableStartDate: string;
  availableEndDate: string;
  startTime: string;
  endTime: string;
  area: string;
  city: string;
  country: string;
  dayPassPrices: {
    [key: string]: string;
  };
  selectedDayPasses: string[];
  otherDayPassName: string;
}

interface DayPassOption {
  id: string;
  label: string;
}

const dayPassOptions: DayPassOption[] = [
  { id: 'poolOnly', label: 'Day Pass Pool Only' },
  { id: 'gymOnly', label: 'Day Pass Gym Only' },
  { id: 'poolGym', label: 'Day Pass Pool/Gym' },
  { id: 'saunaSteam', label: 'Day Pass Sauna/Steam only' },
  { id: 'allInclusive', label: 'Day Pass All Inclusive' },
  { id: 'beachAccess', label: 'Day Pass Beach access' },
  { id: 'poolAccess', label: 'Day Pass Pool access' }
];

export function VendorRegistration() {
  const [formData, setFormData] = useState<FormData>({
    venueName: '',
    venueEmail: '',
    contactFirstName: '',
    contactLastName: '',
    venueType: 'Gym',
    facilityItem: 'Gym',
    facilityOptions: [],
    otherFacilityOption: '',
    availableStartDate: '',
    availableEndDate: '',
    startTime: '',
    endTime: '',
    area: '',
    city: '',
    country: '',
    dayPassPrices: {},
    selectedDayPasses: [],
    otherDayPassName: ''
  });

  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const facilityAdditionalOptions = [
    'Sauna Room',
    'Steam Room',
    'Jacuzzi',
    'Spa',
    'Kids Play area',
    'Beach Access',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceChange = (optionId: string, value: string) => {
    // Only allow numbers and one decimal point
    const formattedValue = value.replace(/[^\d.]/g, '');
    const parts = formattedValue.split('.');
    
    // Ensure only one decimal point and three decimal places
    let validValue = parts[0] || '';
    if (parts.length > 1) {
      validValue += '.' + (parts[1] || '').slice(0, 3);
    }

    setFormData(prev => ({
      ...prev,
      dayPassPrices: {
        ...prev.dayPassPrices,
        [optionId]: validValue
      }
    }));
  };

  const handleDayPassToggle = (optionId: string) => {
    setFormData(prev => {
      const selected = [...prev.selectedDayPasses];
      if (selected.includes(optionId)) {
        return {
          ...prev,
          selectedDayPasses: selected.filter(id => id !== optionId),
          dayPassPrices: {
            ...prev.dayPassPrices,
            [optionId]: '' // Clear price when option is deselected
          }
        };
      } else {
        return {
          ...prev,
          selectedDayPasses: [...selected, optionId]
        };
      }
    });
  };

  const handleOptionToggle = (option: string) => {
    setFormData(prev => {
      const options = [...prev.facilityOptions];
      if (options.includes(option)) {
        return {
          ...prev,
          facilityOptions: options.filter(item => item !== option)
        };
      } else {
        return {
          ...prev,
          facilityOptions: [...options, option]
        };
      }
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, dateType: 'start' | 'end') => {
    const value = e.target.value;
    
    // For manual input in dd/mm/yyyy format
    if (dateType === 'start') {
      setStartDateInput(value);
      
      // Try to convert DD/MM/YYYY to YYYY-MM-DD for the actual date value
      if (value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const [day, month, year] = value.split('/');
        setFormData(prev => ({
          ...prev,
          availableStartDate: `${year}-${month}-${day}`
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          availableStartDate: value
        }));
      }
    } else {
      setEndDateInput(value);
      
      // Try to convert DD/MM/YYYY to YYYY-MM-DD for the actual date value
      if (value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const [day, month, year] = value.split('/');
        setFormData(prev => ({
          ...prev,
          availableEndDate: `${year}-${month}-${day}`
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          availableEndDate: value
        }));
      }
    }
  };

  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>, dateType: 'start' | 'end') => {
    const value = e.target.value;
    
    // If using the date picker, convert the YYYY-MM-DD to DD/MM/YYYY for display
    if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = value.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      
      if (dateType === 'start') {
        setStartDateInput(formattedDate);
        setFormData(prev => ({
          ...prev,
          availableStartDate: value
        }));
        setShowStartDatePicker(false);
      } else {
        setEndDateInput(formattedDate);
        setFormData(prev => ({
          ...prev,
          availableEndDate: value
        }));
        setShowEndDatePicker(false);
      }
    }
  };

  return (
    <>
      <SEO 
        title="Register Your Fitness Venue"
        description="Join Narah as a fitness venue partner. Register your gym, hotel fitness center, or wellness facility to reach more customers in Bahrain."
        canonicalUrl="https://narah.com/vendors"
        keywords="register gym Bahrain, list fitness center Bahrain, gym partnership Bahrain, hotel gym registration, fitness venue registration"
      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold text-center mb-2">Vendor Registration Form</h1>
            <p className="text-gray-600 text-center mb-8">For Gyms/Hotels/Fitness Centers</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="venueName" className="block text-sm font-medium text-gray-700 mb-1">
                  1. Venue Name (Hotel/Gym/Fitness Center)
                </label>
                <input
                  type="text"
                  id="venueName"
                  name="venueName"
                  value={formData.venueName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="venueEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  2. Venue Contact Email
                </label>
                <input
                  type="email"
                  id="venueEmail"
                  name="venueEmail"
                  value={formData.venueEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactFirstName" className="block text-sm font-medium text-gray-700 mb-1">
                    3a. Contact First Name
                  </label>
                  <input
                    type="text"
                    id="contactFirstName"
                    name="contactFirstName"
                    value={formData.contactFirstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contactLastName" className="block text-sm font-medium text-gray-700 mb-1">
                    3b. Contact Last Name
                  </label>
                  <input
                    type="text"
                    id="contactLastName"
                    name="contactLastName"
                    value={formData.contactLastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="venueType" className="block text-sm font-medium text-gray-700 mb-1">
                  4. Venue Type
                </label>
                <select
                  id="venueType"
                  name="venueType"
                  value={formData.venueType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="Gym">Gym</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Fitness Center">Fitness Center</option>
                </select>
              </div>

              <div>
                <label htmlFor="facilityItem" className="block text-sm font-medium text-gray-700 mb-1">
                  5. Facility Item
                </label>
                <select
                  id="facilityItem"
                  name="facilityItem"
                  value={formData.facilityItem}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="Gym">Gym</option>
                  <option value="Group Exercise room">Group Exercise room</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  6. Facility Additional Options
                </label>
                <div className="space-y-2">
                  {facilityAdditionalOptions.map((option) => (
                    <div 
                      key={option}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleOptionToggle(option)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                          formData.facilityOptions.includes(option) 
                            ? 'border-purple-600 bg-purple-600' 
                            : 'border-gray-400'
                        }`}>
                          {formData.facilityOptions.includes(option) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="font-medium text-sm">{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {formData.facilityOptions.includes('Other') && (
                  <div className="mt-3">
                    <label htmlFor="otherFacilityOption" className="block text-sm font-medium text-gray-700 mb-1">
                      Please specify other facility option
                    </label>
                    <input
                      type="text"
                      id="otherFacilityOption"
                      name="otherFacilityOption"
                      value={formData.otherFacilityOption}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-center mb-4 text-purple-600">7. Day Pass Options and Prices</h3>
                <div className="space-y-3">
                  {dayPassOptions.map((option) => (
                    <div 
                      key={option.id}
                      className={`bg-gray-50 p-4 rounded-lg transition-colors ${
                        formData.selectedDayPasses.includes(option.id) ? 'bg-purple-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex items-center space-x-3 cursor-pointer"
                          onClick={() => handleDayPassToggle(option.id)}
                        >
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                            formData.selectedDayPasses.includes(option.id)
                              ? 'border-purple-600 bg-purple-600'
                              : 'border-gray-400'
                          }`}>
                            {formData.selectedDayPasses.includes(option.id) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="font-medium">{option.label}</span>
                        </div>
                        <div className="relative w-32">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">BD</span>
                          <input
                            type="text"
                            id={option.id}
                            value={formData.dayPassPrices[option.id] || ''}
                            onChange={(e) => handlePriceChange(option.id, e.target.value)}
                            placeholder="00.000"
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Other Day Pass Option */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex-grow">
                        <input
                          type="text"
                          name="otherDayPassName"
                          value={formData.otherDayPassName}
                          onChange={handleChange}
                          placeholder="Other Day Pass Option"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="relative w-32 flex-shrink-0">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">BD</span>
                        <input
                          type="text"
                          id="otherDayPassPrice"
                          value={formData.dayPassPrices.other || ''}
                          onChange={(e) => handlePriceChange('other', e.target.value)}
                          placeholder="00.000"
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="availableStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                  8. Available Start Date (dd/mm/yyyy)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="availableStartDate"
                    name="availableStartDate"
                    placeholder="dd/mm/yyyy"
                    value={startDateInput}
                    onChange={(e) => handleDateChange(e, 'start')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <Calendar 
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" 
                    onClick={() => setShowStartDatePicker(true)}
                  />
                  {showStartDatePicker && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                      <div className="p-2">
                        <input 
                          type="date"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          onChange={(e) => handleDatePickerChange(e, 'start')}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="availableEndDate" className="block text-sm font-medium text-gray-700 mb-1">
                  9. Available End Date (dd/mm/yyyy)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="availableEndDate"
                    name="availableEndDate"
                    placeholder="dd/mm/yyyy"
                    value={endDateInput}
                    onChange={(e) => handleDateChange(e, 'end')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <Calendar 
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" 
                    onClick={() => setShowEndDatePicker(true)}
                  />
                  {showEndDatePicker && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                      <div className="p-2">
                        <input 
                          type="date"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          onChange={(e) => handleDatePickerChange(e, 'end')}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    10a. Start Time
                  </label>
                  <select
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select time</option>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <option key={hour} value={`${hour}:00`}>
                          {`${hour}:00`}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    10b. End Time
                  </label>
                  <select
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select time</option>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <option key={hour} value={`${hour}:00`}>
                          {`${hour}:00`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                  11. Area
                </label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  12. City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  13. Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}