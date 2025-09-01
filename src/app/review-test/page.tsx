"use client";

import { useState } from 'react';
import ProductReviews from '@/components/ProductReviews';
import FarmerRatingComponent from '@/components/FarmerRatingComponent';

export default function ReviewTestPage() {
  const [testProductId] = useState('test-product-id');
  const [testFarmerId] = useState('test-farmer-id');
  const [testUserId] = useState('test-user-id');

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Review & Rating System Test
          </h1>
          <p className="text-gray-600">
            This page demonstrates the review and rating functionality for the Harvest Direct platform.
          </p>
        </div>

        {/* Product Reviews Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Product Reviews Demo
          </h2>
          <ProductReviews
            productId={testProductId}
            currentUserId={testUserId}
            isConsumer={true}
          />
        </div>

        {/* Farmer Rating Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Farmer Rating Demo
          </h2>
          <FarmerRatingComponent
            farmerId={testFarmerId}
            farmerName="Test Farmer"
            currentUserId={testUserId}
            isConsumer={true}
            showRatingForm={false}
          />
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">
            How to Use the Review & Rating System
          </h3>
          <div className="space-y-4 text-blue-800">
            <div>
              <h4 className="font-semibold">Product Reviews:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Consumers can write reviews and rate products from 1-5 stars</li>
                <li>Reviews are displayed with user information and helpful voting</li>
                <li>Verified purchase badges are shown for confirmed buyers</li>
                <li>Reviews can be sorted by newest, oldest, rating, or helpfulness</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Farmer Ratings:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Consumers can rate farmers overall and by categories (quality, communication, delivery, etc.)</li>
                <li>Ratings are linked to specific orders for verification</li>
                <li>Category-based ratings provide detailed feedback</li>
                <li>Aggregate ratings help other consumers make informed decisions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Integration:</h4>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Product browsing shows average ratings and review counts</li>
                <li>Order history includes rating options for delivered orders</li>
                <li>Detailed product views include full review sections</li>
                <li>Farmer profiles display rating summaries</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
