"use client";

import { useState, useEffect } from 'react';

interface FarmerProfile {
  id: string;
  farmName: string;
  farmAddress: string;
  farmSize: string;
  farmingPractices: string[];
  certifications: string[];
  aboutFarm: string | null;
  contactPhone: string | null;
  website: string | null;
  specialization: string[];
  experience: number | null;
  status: string;
  certificationBadge: string | null;
  approvedAt: string | null;
  createdAt: string;
  farmer: {
    id: string;
    name: string;
    email: string;
  };
}

interface FarmerProfileProps {
  farmerId: string;
}

const farmingPracticesOptions = [
  'Organic',
  'Sustainable',
  'Conventional',
  'Permaculture',
  'Biodynamic',
  'No-till',
  'Crop Rotation',
  'Integrated Pest Management',
  'Water Conservation',
  'Soil Conservation'
];

const specializationOptions = [
  'Vegetables',
  'Fruits',
  'Grains',
  'Herbs',
  'Dairy',
  'Meat',
  'Poultry',
  'Eggs',
  'Flowers',
  'Seeds'
];

export default function FarmerProfile({ farmerId }: FarmerProfileProps) {
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    farmName: '',
    farmAddress: '',
    farmSize: '',
    farmingPractices: [] as string[],
    certifications: [] as string[],
    aboutFarm: '',
    contactPhone: '',
    website: '',
    specialization: [] as string[],
    experience: ''
  });

  useEffect(() => {
    fetchProfile();
  }, [farmerId]);

  async function fetchProfile() {
    try {
      const response = await fetch(`/api/farmer/profile?farmerId=${farmerId}`);
      const data = await response.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
        setFormData({
          farmName: data.profile.farmName || '',
          farmAddress: data.profile.farmAddress || '',
          farmSize: data.profile.farmSize || '',
          farmingPractices: data.profile.farmingPractices || [],
          certifications: data.profile.certifications || [],
          aboutFarm: data.profile.aboutFarm || '',
          contactPhone: data.profile.contactPhone || '',
          website: data.profile.website || '',
          specialization: data.profile.specialization || [],
          experience: data.profile.experience?.toString() || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  function handleArrayChange(field: 'farmingPractices' | 'specialization', value: string, checked: boolean) {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  }

  function handleCertificationChange(index: number, value: string) {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => i === index ? value : cert)
    }));
  }

  function addCertification() {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, '']
    }));
  }

  function removeCertification(index: number) {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const url = '/api/farmer/profile';
      const method = profile ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        farmerId,
        certifications: formData.certifications.filter(cert => cert.trim() !== '')
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        setMessage(data.message || 'Profile submitted for review!');
        setShowForm(false);
        fetchProfile();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Failed to submit profile');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    const baseClasses = "px-3 py-1 text-sm font-medium rounded-full";
    switch (status) {
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'APPROVED':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'REJECTED':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Profile & Certification</h2>
            <p className="text-sm text-gray-600">Manage your farm profile and certification status</p>
          </div>
          {!profile && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {showForm ? 'Cancel' : 'Create Profile'}
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="mx-6 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-700 text-sm">{message}</p>
        </div>
      )}

      {profile && (
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{profile.farmName}</h3>
              <p className="text-sm text-gray-600">{profile.farmAddress}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={getStatusBadge(profile.status)}>
                {profile.status}
              </span>
              {profile.status === 'APPROVED' && profile.certificationBadge && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  🏆 {profile.certificationBadge}
                </span>
              )}
              {(profile.status === 'PENDING' || profile.status === 'REJECTED') && (
                <button
                  onClick={() => setShowForm(true)}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Farm Details</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><span className="font-medium">Size:</span> {profile.farmSize}</li>
                {profile.experience && (
                  <li><span className="font-medium">Experience:</span> {profile.experience} years</li>
                )}
                {profile.contactPhone && (
                  <li><span className="font-medium">Phone:</span> {profile.contactPhone}</li>
                )}
                {profile.website && (
                  <li><span className="font-medium">Website:</span> 
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                      {profile.website}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Specialization</h4>
              <div className="flex flex-wrap gap-2">
                {profile.specialization.map((spec, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Farming Practices</h4>
              <div className="flex flex-wrap gap-2">
                {profile.farmingPractices.map((practice, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {practice}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {profile.certifications.map((cert, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {profile.aboutFarm && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">About Our Farm</h4>
              <p className="text-sm text-gray-600">{profile.aboutFarm}</p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {profile ? 'Edit Farm Profile' : 'Create Farm Profile'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="farmName" className="block text-sm font-medium text-gray-700">
                  Farm Name *
                </label>
                <input
                  type="text"
                  id="farmName"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-800"
                  placeholder="e.g., Green Valley Farm"
                />
              </div>

              <div>
                <label htmlFor="farmSize" className="block text-sm font-medium text-gray-700">
                  Farm Size *
                </label>
                <input
                  type="text"
                  id="farmSize"
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-800"
                  placeholder="e.g., 10 acres, 5 hectares"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="farmAddress" className="block text-sm font-medium text-gray-700">
                  Farm Address *
                </label>
                <input
                  type="text"
                  id="farmAddress"
                  name="farmAddress"
                  value={formData.farmAddress}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-800"
                  placeholder="Full farm address including city, state"
                />
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-800"
                  placeholder="Years"
                />
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-800"
                  placeholder="Phone number"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website (optional)
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-800"
                  placeholder="https://your-farm-website.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farming Practices
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {farmingPracticesOptions.map((practice) => (
                  <label key={practice} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.farmingPractices.includes(practice)}
                      onChange={(e) => handleArrayChange('farmingPractices', practice, e.target.checked)}
                      className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{practice}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {specializationOptions.map((spec) => (
                  <label key={spec} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.specialization.includes(spec)}
                      onChange={(e) => handleArrayChange('specialization', spec, e.target.checked)}
                      className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{spec}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Existing Certifications
              </label>
              {formData.certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={cert}
                    onChange={(e) => handleCertificationChange(index, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-800"
                    placeholder="e.g., USDA Organic, Fair Trade"
                  />
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addCertification}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                + Add Certification
              </button>
            </div>

            <div>
              <label htmlFor="aboutFarm" className="block text-sm font-medium text-gray-700">
                About Your Farm
              </label>
              <textarea
                id="aboutFarm"
                name="aboutFarm"
                rows={4}
                value={formData.aboutFarm}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-800"
                placeholder="Tell customers about your farm, your story, sustainable practices, etc."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : (profile ? 'Update Profile' : 'Submit for Review')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
