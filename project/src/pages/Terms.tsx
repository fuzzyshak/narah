import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Dumbbell } from 'lucide-react';

export function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-center mb-8">
            <Dumbbell className="text-purple-600 w-8 h-8 transform -rotate-45 mr-3" />
            <h1 className="text-3xl font-bold">Terms and Conditions</h1>
          </div>

          <div className="prose prose-purple max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              Welcome to Narah. By using our platform to book gym and fitness services, you agree to the following terms and conditions. Please read them carefully before proceeding with any booking.
            </p>

            <h2 className="text-xl font-semibold text-purple-600 mt-8 mb-4">1. General Terms</h2>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Narah provides an online platform for booking access to gyms, hotel fitness centers, and wellness facilities.</li>
              <li>Each booking is assigned to an individual user based on the name and email provided at the time of booking.</li>
              <li>Users are responsible for ensuring that all information entered during booking is accurate and up to date.</li>
            </ul>

            <h2 className="text-xl font-semibold text-purple-600 mt-8 mb-4">2. Booking and Check-In</h2>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Upon booking, users must check in at the hotel or gym reception desk at the selected venue.</li>
              <li>To confirm identity, users must present a valid government-issued ID (e.g., driver's license or national ID).</li>
              <li>Bookings are non-transferable and cannot be assigned to another individual.</li>
            </ul>

            <h2 className="text-xl font-semibold text-purple-600 mt-8 mb-4">3. Payment Options</h2>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Users may choose to pay online or at the reception desk upon arrival.</li>
              <li>If opting for on-site payment, users must inform the reception desk and complete payment via card or BENEFIT.</li>
              <li>Prices and payment options vary depending on the venue and type of pass selected.</li>
            </ul>

            <h2 className="text-xl font-semibold text-purple-600 mt-8 mb-4">4. Venue-Specific Rules</h2>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Users must adhere to all rules and regulations set by the gym or hotel where the booking is made.</li>
              <li>Facilities may have different access policies; some venues may offer gym-only passes, while others provide pool and spa access as part of the package.</li>
              <li>Users are responsible for reviewing the terms of each venue's Day Pass before making a booking.</li>
              <li>The gym venue will ask to show your ID when you check in. The gym venue will ask you to keep your ID at the reception desk and hand it back to you when you leave – check out.</li>
            </ul>

            <h2 className="text-xl font-semibold text-purple-600 mt-8 mb-4">5. Age Restrictions</h2>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Individuals under 16 years old are generally not permitted to enter most gym facilities.</li>
              <li>Some hotels may allow minors access to pools or beaches but not gym areas—users should verify restrictions before booking.</li>
            </ul>

            <h2 className="text-xl font-semibold text-purple-600 mt-8 mb-4">6. Cancellations and Refunds</h2>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Cancellation policies are set by the venue, and refunds (if applicable) are subject to the terms of the selected gym or hotel.</li>
              <li>Users should review the cancellation terms before confirming their booking.</li>
            </ul>

            <h2 className="text-xl font-semibold text-purple-600 mt-8 mb-4">7. Liability and Responsibility</h2>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Narah acts as a booking facilitator and is not responsible for the quality of services provided by the venue.</li>
              <li>Users acknowledge that participation in any fitness activity involves risks, and they assume full responsibility for their safety and well-being.</li>
              <li>Narah is not liable for injuries, accidents, or losses incurred at any venue booked through our platform.</li>
            </ul>

            <h2 className="text-xl font-semibold text-purple-600 mt-8 mb-4">8. Changes to Terms</h2>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Narah reserves the right to update these Terms and Conditions at any time.</li>
              <li>Continued use of the platform constitutes acceptance of the updated terms.</li>
            </ul>

            <h2 className="text-xl font-semibold text-purple-600 mt-8 mb-4">9. Confidentiality</h2>
            <p className="text-lg leading-relaxed mb-4">
              At Narah, we value your privacy and are committed to protecting your personal information. We do not share your data with third parties, advertisers, or any external organizations beyond what is necessary to facilitate your bookings. Your information is securely stored using advanced security measures, including encryption technologies, to safeguard all user data.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              User data is collected solely for the purpose of managing and processing your bookings. To ensure a smooth check-in process at the selected gym or fitness venue, the following details will be shared with the venue upon booking:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Your full name</li>
              <li>Your email address</li>
              <li>Your mobile number</li>
            </ul>
            <p className="text-lg leading-relaxed mb-4">
              This information is required to verify your identity at check-in and confirm that you are the rightful holder of the booking. The venue will use these details strictly for authentication purposes and to grant access to the booked facility.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Narah is committed to maintaining the confidentiality and security of your personal data, ensuring that it is used responsibly and in compliance with all applicable privacy regulations.
            </p>

            <p className="text-lg leading-relaxed mt-8">
              For any inquiries, please contact us through our{' '}
              <Link to="/contact" className="text-purple-600 hover:text-purple-700">
                contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}