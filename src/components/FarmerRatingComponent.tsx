"use client";

import { useState, useEffect } from 'react';

interface FarmerRating {
  id: string;
  rating: number;
  comment?: string;
  categories?: Record<string, number>;
  verified: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
  order?: {
    id: string;
    createdAt: string;
  };
}

interface RatingStats {
  averageRating: number;
  totalRatings: number;
  distribution: Array<{
    star: number;
    count: number;
  }>;
  categoryAverages: Record<string, number>;
}

interface FarmerRatingComponentProps {
  farmerId: string;
  farmerName: string;
  currentUserId?: string;
  isConsumer?: boolean;
  showRatingForm?: boolean;
  orderId?: string;
  onRatingAdded?: () => void;
}

const defaultCategories = {
  quality: 'Product Quality',
  communication: 'Communication',
  delivery: 'Delivery Time',
  packaging: 'Packaging',
  value: 'Value for Money'
};

export default function FarmerRatingComponent({ 
  farmerId, 
  farmerName,
  currentUserId, 
  isConsumer = false,
  showRatingForm = false,
  orderId,
  onRatingAdded 
}: FarmerRatingComponentProps) {
  const [ratings, setRatings] = useState<FarmerRating[]>([]);
  const [stats, setStats] = useState<RatingStats>({
    averageRating: 0,
    totalRatings: 0,
    distribution: [],
    categoryAverages: {}
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(showRatingForm);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Rating form state
  const [ratingForm, setRatingForm] = useState({
    rating: 0,
    comment: '',
    categories: Object.keys(defaultCategories).reduce((acc, key) => ({ ...acc, [key]: 0 }), {} as Record<string, number>)
  });
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    fetchRatings();
  }, [farmerId, currentPage]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });

      const response = await fetch(`/api/farmers/${farmerId}/ratings?${params}`);
      const data = await response.json();

      if (data.success) {
        setRatings(data.ratings);
        setStats(data.stats);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching farmer ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async () => {
    if (!currentUserId || !ratingForm.rating) {
      alert('Please provide a rating');
      return;
    }

    try {
      setSubmittingRating(true);
      const response = await fetch(`/api/farmers/${farmerId}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          orderId,
          ...ratingForm
        })
      });

      const data = await response.json();

      if (data.success) {
        setRatingForm({
          rating: 0,
          comment: '',
          categories: Object.keys(defaultCategories).reduce((acc, key) => ({ ...acc, [key]: 0 }), {} as Record<string, number>)
        });
        setShowForm(false);
        await fetchRatings();
        if (onRatingAdded) onRatingAdded();
        alert('Rating submitted successfully!');
      } else {
        alert(data.error || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md', interactive = false, onRate?: (rating: number) => void) => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate && onRate(star)}
            className={`${sizes[size]} ${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
            }`}
          >
            <svg
              fill={star <= rating ? '#fbbf24' : '#e5e7eb'}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        {!interactive && (
          <span className="text-sm text-gray-600 ml-2">
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    );
  };

  const renderCategoryRatings = (categories: Record<string, number>) => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
        {Object.entries(categories).map(([key, value]) => (
          <div key={key} className="text-center">
            <div className="text-xs text-gray-600 mb-1">
              {defaultCategories[key as keyof typeof defaultCategories] || key}
            </div>
            <div className="flex justify-center">
              {renderStars(value, 'sm')}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Farmer Rating - {farmerName}
          </h3>
          {isConsumer && currentUserId && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Rate Farmer
            </button>
          )}
        </div>

        {/* Overall Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {stats.averageRating.toFixed(1)}
            </div>
            {renderStars(stats.averageRating, 'lg')}
            <div className="text-sm text-gray-600 mt-2">
              Based on {stats.totalRatings} rating{stats.totalRatings !== 1 ? 's' : ''}
            </div>
          </div>
          
          {/* Category Averages */}
          {Object.keys(stats.categoryAverages).length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Average Ratings by Category</h4>
              {renderCategoryRatings(stats.categoryAverages)}
            </div>
          )}
        </div>

        {/* Rating Form */}
        {showForm && (
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Rate Your Experience</h4>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating *
                </label>
                {renderStars(ratingForm.rating, 'lg', true, (rating) =>
                  setRatingForm(prev => ({ ...prev, rating }))
                )}
              </div>

              {/* Category Ratings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rate by Category (Optional)
                </label>
                <div className="space-y-4">
                  {Object.entries(defaultCategories).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 w-1/3">{label}</span>
                      <div className="flex-1 flex justify-center">
                        {renderStars(
                          ratingForm.categories[key], 
                          'md', 
                          true, 
                          (rating) => setRatingForm(prev => ({
                            ...prev,
                            categories: { ...prev.categories, [key]: rating }
                          }))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Comments (Optional)
                </label>
                <textarea
                  value={ratingForm.comment}
                  onChange={(e) => setRatingForm(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience with this farmer..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={submitRating}
                  disabled={submittingRating || !ratingForm.rating}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  {submittingRating ? 'Submitting...' : 'Submit Rating'}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setRatingForm({
                      rating: 0,
                      comment: '',
                      categories: Object.keys(defaultCategories).reduce((acc, key) => ({ ...acc, [key]: 0 }), {} as Record<string, number>)
                    });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ratings List */}
      <div className="divide-y divide-gray-200">
        {ratings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No ratings yet</h3>
            <p className="text-gray-500">Be the first to rate this farmer!</p>
          </div>
        ) : (
          ratings.map((rating) => (
            <div key={rating.id} className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {rating.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {rating.user.name}
                      </span>
                      {rating.verified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Verified Transaction
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {renderStars(rating.rating)}

                  {rating.comment && (
                    <p className="text-gray-700 mt-2 leading-relaxed">
                      {rating.comment}
                    </p>
                  )}

                  {rating.categories && Object.keys(rating.categories).length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Category Ratings</h5>
                      {renderCategoryRatings(rating.categories as Record<string, number>)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
