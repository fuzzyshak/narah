import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Dumbbell } from 'lucide-react';

export function About() {
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
            <h1 className="text-3xl font-bold">About Us</h1>
          </div>

          <div className="prose prose-purple max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              Welcome to Narah, your ultimate destination for seamless gym and fitness class bookings. 
              We believe that staying active should be easy, flexible, and accessible to everyone—no 
              long-term commitments, no hassle, just fitness on your terms.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              With Narah, you can effortlessly discover gyms, fitness centers, and hotel gyms nearby, 
              all in one place. Whether you're traveling, exploring new workout spaces, or simply 
              looking for a change of scenery, our platform lets you browse, book, and pay online 
              with ease. Say goodbye to rigid memberships and hello to total flexibility.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Our mission is to connect fitness enthusiasts with top-rated gyms and classes, giving 
              you the freedom to work out whenever and wherever you choose. From high-end fitness 
              clubs to specialized studios, Narah ensures you find the perfect workout spot with 
              just a few clicks.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              At Narah, we are committed to making fitness more accessible and convenient for everyone. 
              Whether you're a casual gym-goer or a fitness enthusiast, we provide the flexibility 
              you need to stay active without the commitment of a traditional membership.
            </p>

            <Link to="/register" className="text-lg leading-relaxed font-medium text-purple-600 hover:text-purple-700">
              Join Narah today - one workout at a time
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}