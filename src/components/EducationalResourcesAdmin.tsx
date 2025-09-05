'use client';

import { useState, useEffect } from 'react';

interface EducationalResource {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  author?: string;
  publishedBy: string;
  published: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ResourceFormData {
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string;
  imageUrl: string;
  author: string;
  published: boolean;
}

export default function EducationalResourcesAdmin() {
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<EducationalResource | null>(null);
  const [formData, setFormData] = useState<ResourceFormData>({
    title: '',
    content: '',
    summary: '',
    category: '',
    tags: '',
    imageUrl: '',
    author: '',
    published: false,
  });

  const categories = [
    'Crop Management',
    'Pest Control',
    'Soil Health',
    'Irrigation',
    'Organic Farming',
    'Market Trends',
    'Technology',
    'Sustainability',
    'Weather & Climate',
    'Business Management',
  ];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/admin/educational-resources');
      const data = await response.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const payload = {
        ...formData,
        tags: tagsArray,
        publishedBy: 'admin', // In real app, get from auth context
      };

      let response;
      if (editingResource) {
        response = await fetch(`/api/admin/educational-resources/${editingResource.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('/api/admin/educational-resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        await fetchResources();
        setShowForm(false);
        setEditingResource(null);
        setFormData({
          title: '',
          content: '',
          summary: '',
          category: '',
          tags: '',
          imageUrl: '',
          author: '',
          published: false,
        });
      } else {
        console.error('Error saving resource');
      }
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  const handleEdit = (resource: EducationalResource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      content: resource.content,
      summary: resource.summary || '',
      category: resource.category,
      tags: resource.tags.join(', '),
      imageUrl: resource.imageUrl || '',
      author: resource.author || '',
      published: resource.published,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      try {
        const response = await fetch(`/api/admin/educational-resources/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          await fetchResources();
        }
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  const togglePublishStatus = async (resource: EducationalResource) => {
    try {
      const response = await fetch(`/api/admin/educational-resources/${resource.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...resource,
          published: !resource.published,
        }),
      });
      if (response.ok) {
        await fetchResources();
      }
    } catch (error) {
      console.error('Error updating resource:', error);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-700">Loading educational resources...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Educational Resources Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create New Resource
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {editingResource ? 'Edit Resource' : 'Create New Resource'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1 text-gray-700">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-gray-800 placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-700">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-gray-800"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-700">Summary</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full border rounded px-3 py-2 h-20 text-gray-800 placeholder-gray-500"
                  placeholder="Brief summary of the resource"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-700">Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full border rounded px-3 py-2 h-40 text-gray-800 placeholder-gray-500"
                  placeholder="Main content of the educational resource"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-700">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-gray-800 placeholder-gray-500"
                  placeholder="Enter tags separated by commas"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-700">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-gray-800 placeholder-gray-500"
                  placeholder="Optional featured image URL"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-700">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-gray-800 placeholder-gray-500"
                  placeholder="Author name (optional)"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-gray-700">Publish immediately</label>
              </div>

              <div className="flex space-x-2 pt-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  {editingResource ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingResource(null);
                    setFormData({
                      title: '',
                      content: '',
                      summary: '',
                      category: '',
                      tags: '',
                      imageUrl: '',
                      author: '',
                      published: false,
                    });
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {resources.length === 0 ? (
          <div className="text-center py-8 text-gray-700">
            No educational resources found. Create your first resource!
          </div>
        ) : (
          resources.map((resource) => (
            <div key={resource.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{resource.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-700 mt-1">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {resource.category}
                    </span>
                    <span className="text-gray-700">Views: {resource.viewCount}</span>
                    <span className="text-gray-700">
                      Status: {resource.published ? 'Published' : 'Draft'}
                    </span>
                    {resource.author && <span className="text-gray-700">By: {resource.author}</span>}
                  </div>
                  {resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {resource.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {resource.summary && (
                    <p className="text-gray-700 mt-2">{resource.summary}</p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleEdit(resource)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => togglePublishStatus(resource)}
                  className={`px-3 py-1 rounded text-sm ${
                    resource.published
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {resource.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleDelete(resource.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
