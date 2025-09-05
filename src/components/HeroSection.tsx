"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Beautiful farm images from Unsplash
  const heroImages = [
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate background images
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const stats = [
    { value: "1000+", label: "Fresh Products", icon: "🥬" },
    { value: "500+", label: "Local Farmers", icon: "👨‍🌾" },
    { value: "10k+", label: "Happy Customers", icon: "😊" },
    { value: "100%", label: "Organic Certified", icon: "🌱" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Parallax Effect */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110"
              style={{
                backgroundImage: `url(${image})`,
                filter: 'brightness(0.4) saturate(1.2)'
              }}
            />
          </div>
        ))}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-400/10 rounded-full animate-floating"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-orange-400/10 rounded-full animate-floating" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-400/10 rounded-full animate-floating" style={{animationDelay: '2s'}}></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block animate-slide-in-left">Fresh from</span>
            <span className="block text-gradient animate-slide-in-right" style={{animationDelay: '0.3s'}}>
              Farm to Table
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.6s'}}>
            Connect directly with local farmers for the freshest, most sustainable produce. 
            <span className="text-green-400 font-semibold"> No middlemen, just pure quality.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-scale-in" style={{animationDelay: '0.9s'}}>
            <Link href="/consumer" className="btn-primary text-lg px-8 py-4 group">
              <span className="flex items-center">
                Start Shopping
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
            <Link href="/signup" className="btn-secondary text-lg px-8 py-4 group bg-white/10 border-white/30 text-white hover:bg-white/20">
              <span className="flex items-center">
                Join as Farmer
                <svg className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="animate-fade-in" style={{animationDelay: '1.2s'}}>
            <p className="text-green-400 font-semibold mb-6 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% Certified Organic • Pesticide-Free • Locally Sourced
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-in" style={{animationDelay: '1.5s'}}>
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="glass rounded-xl p-6 hover-lift group"
                style={{animationDelay: `${1.5 + index * 0.2}s`}}
              >
                <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
