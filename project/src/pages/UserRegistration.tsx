import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Check, X, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SEO } from '../components/SEO';

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  mobileNumber: string;
  birthday: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    label: 'At least 8 characters',
    test: (password) => password.length >= 8,
  },
  {
    label: 'Contains uppercase letter',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: 'Contains lowercase letter',
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: 'Contains number',
    test: (password) => /\d/.test(password),
  },
];

export function UserRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
    birthday: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthdayError, setBirthdayError] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmails = useCallback(() => {
    if (!formData.email.includes('@')) {
      return false;
    }

    if (formData.email !== formData.confirmEmail) {
      return false;
    }

    return true;
  }, [formData.email, formData.confirmEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'birthday') {
      const numericValue = value.replace(/[^\d/]/g, '');
      if (numericValue.length <= 10) {
        let formattedValue = numericValue;
        if (numericValue.length >= 2 && !numericValue.includes('/')) {
          formattedValue = numericValue.slice(0, 2) + '/' + numericValue.slice(2);
        }
        if (numericValue.length >= 5 && formattedValue.split('/').length === 2) {
          formattedValue = formattedValue.slice(0, 5) + '/' + formattedValue.slice(5);
        }
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
        validateBirthday(formattedValue);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Update email error when either email field changes
      if (name === 'email' || name === 'confirmEmail') {
        const newFormData = { ...formData, [name]: value };
        if (!newFormData.email.includes('@') && newFormData.email) {
          setEmailError('Please enter a valid email address');
        } else if (newFormData.email !== newFormData.confirmEmail && newFormData.confirmEmail) {
          setEmailError('Email addresses do not match');
        } else {
          setEmailError('');
        }
      }
    }
  };

  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const [year, month, day] = value.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      setFormData(prev => ({ ...prev, birthday: formattedDate }));
      validateBirthday(formattedDate);
      setShowDatePicker(false);
    }
  };

  const validateBirthday = (birthday: string) => {
    setBirthdayError('');
    
    if (!birthday.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      if (birthday) setBirthdayError('Please use the format dd/mm/yyyy');
      return false;
    }

    const [day, month, year] = birthday.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    
    if (birthDate.getDate() !== day || birthDate.getMonth() !== month - 1 || birthDate.getFullYear() !== year) {
      setBirthdayError('Please enter a valid date');
      return false;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 16) {
      setBirthdayError('You must be at least 16 years old to register');
      return false;
    }

    return true;
  };

  const validatePassword = (password: string) => {
    return passwordRequirements.every((requirement) => requirement.test(password));
  };

  const validateForm = useCallback(() => {
    const isEmailValid = validateEmails();
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      isEmailValid &&
      validatePassword(formData.password) &&
      formData.password === formData.confirmPassword &&
      /^\+\d{1,}$/.test(formData.mobileNumber) &&
      validateBirthday(formData.birthday)
    );
  }, [formData, validateEmails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setRegistrationError('');

    try {
      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (!authData.user) throw new Error('User registration failed');

      // Convert birthday from DD/MM/YYYY to YYYY-MM-DD for database
      const [day, month, year] = formData.birthday.split('/');
      const formattedBirthday = `${year}-${month}-${day}`;

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          first_name: formData.firstName,
          middle_name: formData.middleName,
          last_name: formData.lastName,
          birthday: formattedBirthday,
          mobile_number: formData.mobileNumber,
        });

      if (profileError) throw profileError;

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationError(
        error instanceof Error ? error.message : 'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">
              Please check your email to activate your account. The activation link will expire in 24 hours.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Create Account"
        description="Join Narah - Create your account to book fitness classes and gym sessions at Bahrain's premier facilities."
        canonicalUrl="https://narah.com/register"
      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-md">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

            {registrationError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{registrationError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday * (dd/mm/yyyy)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="birthday"
                    name="birthday"
                    required
                    placeholder="dd/mm/yyyy"
                    value={formData.birthday}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      birthdayError ? 'border-red-300' : 'border-gray-300'
                    }`}
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
                          onChange={handleDatePickerChange}
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {birthdayError && (
                  <p className="mt-1 text-sm text-red-600">{birthdayError}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  You must be at least 16 years old to register
                </p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    emailError ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Email Address *
                </label>
                <input
                  type="email"
                  id="confirmEmail"
                  name="confirmEmail"
                  required
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    emailError ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
              </div>

              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number * (with country code)
                </label>
                <input
                  type="text"
                  id="mobileNumber"
                  name="mobileNumber"
                  required
                  placeholder="+123456789"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  pattern="\+\d+"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
                {passwordRequirements.map((requirement, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm"
                  >
                    {requirement.test(formData.password) ? (
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <X className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className={requirement.test(formData.password) ? 'text-green-700' : 'text-gray-600'}>
                      {requirement.label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={!validateForm() || isSubmitting}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Create Account'
                )}
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}