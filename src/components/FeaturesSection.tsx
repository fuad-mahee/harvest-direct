"use client";

import { useState } from 'react';

export default function FeaturesSection() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: "🌱",
      title: "100% Organic",
      description: "All our farmers are certified organic, ensuring you get the purest, most natural produce.",
      color: "green",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Fresh produce delivered to your doorstep within 24 hours of harvest.",
      color: "blue",
      image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      icon: "👨‍🌾",
      title: "Direct from Farmers",
      description: "Skip the middleman and connect directly with local farmers for the best prices.",
      color: "orange",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      icon: "🛡️",
      title: "Quality Guarantee",
      description: "Not satisfied? We offer 100% money-back guarantee on all purchases.",
      color: "purple",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      icon: "🌍",
      title: "Sustainable",
      description: "Supporting eco-friendly farming practices that benefit our planet.",
      color: "teal",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      icon: "💰",
      title: "Fair Prices",
      description: "Best prices for both farmers and consumers with transparent pricing.",
      color: "indigo",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: "bg-green-500 from-green-400 to-green-600",
      blue: "bg-blue-500 from-blue-400 to-blue-600",
      orange: "bg-orange-500 from-orange-400 to-orange-600",
      purple: "bg-purple-500 from-purple-400 to-purple-600",
      teal: "bg-teal-500 from-teal-400 to-teal-600",
      indigo: "bg-indigo-500 from-indigo-400 to-indigo-600"
    };
    return colors[color as keyof typeof colors] || colors.green;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-400 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="text-green-600 font-semibold text-lg tracking-wide uppercase">Why Choose Us</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
            The <span className="text-gradient">Harvest Direct</span> Difference
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing the way you access fresh, local produce by connecting you directly with passionate farmers in your community.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover-lift transition-all duration-500 h-full relative overflow-hidden">
                {/* Background Image on Hover */}
                <div 
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
                    hoveredFeature === index ? 'opacity-10' : 'opacity-0'
                  }`}
                  style={{ backgroundImage: `url(${feature.image})` }}
                />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${getColorClasses(feature.color)} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <span className="text-2xl">{feature.icon}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  {/* Removed 'Learn More' hover effect as requested */}
                </div>

                {/* Decorative Elements */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${getColorClasses(feature.color)} rounded-full filter blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
