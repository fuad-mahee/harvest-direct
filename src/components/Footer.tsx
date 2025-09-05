import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-hero text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-green rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l8 5v6c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V8l8-5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11l4 4 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    Harvest<span className="text-gradient">Direct</span>
                  </h3>
                  <p className="text-sm text-gray-300">Farm to Table</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Connecting local farmers directly with consumers for fresh, sustainable, and high-quality produce. 
                Building a healthier future, one harvest at a time.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.002 2.158c-5.421 0-9.844 4.423-9.844 9.844 0 5.421 4.423 9.844 9.844 9.844s9.844-4.423 9.844-9.844c0-5.421-4.423-9.844-9.844-9.844zm4.441 7.887h-2.946c0 .885-.004 1.587-.004 2.378h2.789v1.651h-2.789v5.926h-2.049v-5.926h-1.938v-1.651h1.938c0-.682.004-1.34.004-2.378 0-1.598.856-2.549 2.548-2.549.747 0 1.369.071 1.547.103v1.686s-.436-.071-.878-.071c-.656 0-.784.309-.784.771z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/consumer" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    Browse Products
                  </Link>
                </li>
                <li>
                  <Link href="/farmer" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    For Farmers
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    Admin Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
              <p className="text-gray-300 text-sm">
                Get the latest updates on fresh products, farmer stories, and sustainable farming practices.
              </p>
              <div className="space-y-3">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  />
                  <button className="px-6 py-3 bg-gradient-green hover:bg-gradient-orange rounded-r-lg transition-all duration-300 hover-glow">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 pt-4">
                <div className="flex items-center space-x-3 text-gray-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">hello@harvestdirect.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-300 text-sm">
              © 2025 Harvest Direct. All rights reserved. Made with ❤️ for sustainable farming.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-300">
              <a href="#" className="hover:text-white transition-colors duration-300">Privacy</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Terms</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Cookies</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Accessibility</a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements for visual appeal */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-green-400/10 rounded-full animate-floating"></div>
      <div className="absolute top-32 right-20 w-16 h-16 bg-orange-400/10 rounded-full animate-floating" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-400/10 rounded-full animate-floating" style={{animationDelay: '2s'}}></div>
    </footer>
  );
}
