import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import ProductBrowsing from '@/components/ProductBrowsing';
import TestimonialsSection from '@/components/TestimonialsSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Product Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <span className="text-green-600 font-semibold text-lg tracking-wide uppercase">Fresh Products</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
              Discover <span className="text-gradient">Local Harvest</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Browse our selection of farm-fresh produce, carefully curated from trusted local farmers. 
              Each product comes with detailed farmer profiles and sustainability information.
            </p>
          </div>
          
          <ProductBrowsing />
          
          {/* CTA to view more products */}
          <div className="text-center mt-12">
            <a 
              href="/consumer" 
              className="btn-primary text-lg px-8 py-4 inline-flex items-center group"
            >
              View All Products
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <span className="text-green-600 font-semibold text-lg tracking-wide uppercase">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
              From <span className="text-gradient">Farm to Your Table</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our simple, transparent process ensures you get the freshest produce while supporting local farmers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-green-200 via-green-400 to-green-200 transform -translate-y-1/2 z-0"></div>
            
            {[
              {
                step: "1",
                title: "Browse Products",
                description: "Explore fresh produce from verified local farmers with detailed profiles and certifications.",
                icon: "🛒"
              },
              {
                step: "2", 
                title: "Place Order",
                description: "Select your favorite items and place your order with transparent pricing and delivery options.",
                icon: "📦"
              },
              {
                step: "3",
                title: "Fresh Harvest",
                description: "Farmers harvest your order fresh, ensuring maximum quality and nutritional value.",
                icon: "🌾"
              },
              {
                step: "4",
                title: "Fast Delivery",
                description: "Receive your fresh produce within 24 hours, delivered straight to your doorstep.",
                icon: "🚚"
              }
            ].map((item, index) => (
              <div key={index} className="relative z-10 text-center group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover-lift transition-all duration-300 mb-6">
                  {/* Step Number */}
                  <div className="w-16 h-16 bg-gradient-green rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                    {item.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-green relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-floating"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-floating" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Stay Fresh with Our Newsletter
            </h2>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Get weekly updates on new farmers, seasonal produce, recipes, and exclusive offers. 
              Join our community of fresh food enthusiasts!
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-l-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/20"
                />
                <button className="px-8 py-4 bg-white text-green-600 font-semibold rounded-r-xl hover:bg-gray-50 transition-colors duration-300 hover-glow">
                  Subscribe
                </button>
              </div>
              <p className="text-green-200 text-sm mt-3">
                No spam, just fresh updates. Unsubscribe anytime.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-green-200">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>10,000+ Subscribers</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Weekly Updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Exclusive Recipes</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}