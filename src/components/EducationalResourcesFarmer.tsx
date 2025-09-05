'use client';

import { useState, useEffect } from 'react';

interface EducationalResource {
  id: string;
  title: string;
  summary?: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  author?: string;
  viewCount: number;
  createdAt: string;
}

interface FullResource extends EducationalResource {
  content: string;
}

export default function EducationalResourcesFarmer() {
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<FullResource | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchResources();
  }, [currentPage, selectedCategory, searchTerm]);

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9',
      });
      
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/farmer/educational-resources?${params}`);
      const data = await response.json();
      
      setResources(data.resources || []);
      setCategories(data.categories || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFullResource = async (id: string) => {
    try {
      const response = await fetch(`/api/farmer/educational-resources/${id}`);
      const data = await response.json();
      setSelectedResource(data);
    } catch (error) {
      console.error('Error fetching resource details:', error);
    }
  };

  const handleResourceClick = (resource: EducationalResource) => {
    fetchFullResource(resource.id);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchResources();
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="p-6">Loading educational resources...</div>;
  }

  if (selectedResource) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedResource(null)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mb-4"
        >
          ← Back to Resources
        </button>
        
        <article className="bg-white rounded-lg shadow-lg p-6">
          {selectedResource.imageUrl && (
            <img
              src={selectedResource.imageUrl}
              alt={selectedResource.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedResource.title}
            </h1>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                {selectedResource.category}
              </span>
              {selectedResource.author && (
                <span>By: {selectedResource.author}</span>
              )}
              <span>Views: {selectedResource.viewCount}</span>
              <span>{formatDate(selectedResource.createdAt)}</span>
            </div>
            
            {selectedResource.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedResource.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 text-sm rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>
          
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {selectedResource.content}
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Educational Resources
        </h1>
        <p className="text-gray-600">
          Discover valuable resources to improve your farming practices
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resources..."
            className="flex-1 border rounded px-4 py-2"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Search
          </button>
        </form>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryFilter('')}
            className={`px-4 py-2 rounded ${
              selectedCategory === ''
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-4 py-2 rounded ${
                selectedCategory === category
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {resources.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            No educational resources found.
          </div>
          {(selectedCategory || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="mt-4 text-green-500 hover:text-green-600"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {resources.map((resource) => (
            <div
              key={resource.id}
              onClick={() => handleResourceClick(resource)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
            >
              {resource.imageUrl && (
                <img
                  src={resource.imageUrl}
                  alt={resource.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded">
                    {resource.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {resource.viewCount} views
                  </span>
                </div>
                
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900">
                  {resource.title}
                </h3>
                
                {resource.summary && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {resource.summary}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  {resource.author && <span>By: {resource.author}</span>}
                  <span>{formatDate(resource.createdAt)}</span>
                </div>
                
                {resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{resource.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 border rounded ${
                currentPage === page
                  ? 'bg-green-500 text-white'
                  : 'hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
