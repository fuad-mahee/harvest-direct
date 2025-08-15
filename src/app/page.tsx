import ProductBrowsing from '@/components/ProductBrowsing';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Harvest Direct</h1>
            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="text-gray-600 hover:text-gray-900"
              >
                Login
              </a>
              <a
                href="/signup"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Fresh Farm Products Direct to You
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse fresh, local produce from certified farmers. Hover over farmer names to see their profiles and certifications.
            </p>
          </div>
          
          <ProductBrowsing />
        </div>
      </div>
    </div>
  );
}