import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  onClose: () => void;
}

export function ImageGallery({ images, onClose }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextImage = () => {
    if (isAnimating) return;
    setDirection('right');
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    if (isAnimating) return;
    setDirection('left');
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setDirection(null);
      }, 300); // Match this with the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const getSlideClass = () => {
    if (!direction) return '';
    if (direction === 'right') return 'animate-slide-left';
    return 'animate-slide-right';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
      >
        <X className="w-8 h-8" />
      </button>
      
      <button
        onClick={previousImage}
        className="absolute left-4 text-white hover:text-gray-300 transition-colors"
        disabled={isAnimating}
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      
      <div className="relative w-full max-w-[90vw] h-[90vh] overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          className={`absolute inset-0 m-auto max-h-full max-w-full object-contain transition-transform duration-300 ${getSlideClass()}`}
        />
      </div>
      
      <button
        onClick={nextImage}
        className="absolute right-4 text-white hover:text-gray-300 transition-colors"
        disabled={isAnimating}
      >
        <ChevronRight className="w-8 h-8" />
      </button>
      
      <div className="absolute bottom-4 text-white">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}