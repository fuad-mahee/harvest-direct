"use client";

import { useState, useEffect } from 'react';

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Home Chef & Mother",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "Harvest Direct has completely transformed how I shop for groceries. The vegetables are incredibly fresh, and knowing they come directly from local farmers makes every meal feel special. My kids even notice the difference in taste!",
      location: "San Francisco, CA"
    },
    {
      name: "Michael Chen",
      role: "Restaurant Owner",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "As a restaurant owner, quality is everything. Harvest Direct provides the freshest ingredients I've ever worked with. The direct farmer connection means I can serve dishes that truly showcase the natural flavors of the produce.",
      location: "Austin, TX"
    },
    {
      name: "Emily Rodriguez",
      role: "Nutritionist",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "I recommend Harvest Direct to all my clients. The organic certification and transparency about farming practices give me confidence that I'm suggesting the healthiest options available. The nutritional value is outstanding.",
      location: "Denver, CO"
    },
    {
      name: "David Thompson",
      role: "Local Farmer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "Harvest Direct has been a game-changer for my small farm. I can now reach customers directly, get fair prices for my produce, and build relationships with people who appreciate quality farming. It's exactly what farmers need.",
      location: "Farmer in Vermont"
    },
    {
      name: "Lisa Park",
      role: "Busy Professional",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "The convenience and quality are unmatched. I love that I can order fresh produce online and have it delivered the next day. The packaging is eco-friendly, and everything arrives in perfect condition. Highly recommended!",
      location: "Seattle, WA"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-white to-orange-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-green-400 rounded-full filter blur-3xl animate-floating"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange-400 rounded-full filter blur-3xl animate-floating" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="text-green-600 font-semibold text-lg tracking-wide uppercase">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
            What Our <span className="text-gradient">Community</span> Says
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Real stories from farmers, chefs, families, and food lovers who've experienced the Harvest Direct difference.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="relative">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mx-auto max-w-4xl relative overflow-hidden animate-scale-in">
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 text-green-200 opacity-50">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
              </svg>
            </div>

            {/* Content */}
            <div className="text-center relative z-10">
              {/* Stars */}
              <div className="flex justify-center mb-6">
                {renderStars(testimonials[currentTestimonial].rating)}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8 italic">
                "{testimonials[currentTestimonial].text}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-center space-x-4">
                <img
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-green-200"
                />
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-lg">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-green-600 font-medium">
                    {testimonials[currentTestimonial].role}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {testimonials[currentTestimonial].location}
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-green-100 to-transparent rounded-full"></div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial 
                    ? 'bg-green-600 scale-125 shadow-lg' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Smaller Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover-lift group cursor-pointer">
              <div className="flex justify-center mb-4">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3 text-sm">
                "{testimonial.text}"
              </p>
              <div className="flex items-center space-x-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-green-600 text-xs">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold">4.9/5</div>
                <div className="text-green-200 text-sm">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold">2,500+</div>
                <div className="text-green-200 text-sm">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-green-200 text-sm">Partner Farmers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">100%</div>
                <div className="text-green-200 text-sm">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
