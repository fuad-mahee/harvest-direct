'use client';
import { useState, useEffect } from 'react';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  duration?: number;
  maxAttendees?: number;
  currentAttendees: number;
  eventType: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    attendees: number;
  };
  createdAt: string;
  updatedAt: string;
}

const eventTypes = ['WORKSHOP', 'MEETUP', 'CONFERENCE', 'TRAINING', 'NETWORKING'];
const categories = [
  'Organic Farming', 
  'Pest Control', 
  'Soil Health', 
  'Crop Management', 
  'Marketing', 
  'Technology',
  'Sustainability',
  'Business Development'
];

export default function EventManagement({ farmerId }: { farmerId: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    duration: '',
    maxAttendees: '',
    eventType: '',
    category: '',
    tags: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`/api/farmer/events?farmerId=${farmerId}`);
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const eventData = {
        farmerId,
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : null,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      const url = editingEvent ? `/api/farmer/events/${editingEvent.id}` : '/api/farmer/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      if (response.ok) {
        resetForm();
        fetchEvents();
        alert(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Error saving event');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event');
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      date: new Date(event.date).toISOString().slice(0, 16),
      duration: event.duration?.toString() || '',
      maxAttendees: event.maxAttendees?.toString() || '',
      eventType: event.eventType,
      category: event.category,
      tags: event.tags.join(', '),
      imageUrl: event.imageUrl || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/farmer/events/${eventId}?farmerId=${farmerId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchEvents();
        alert('Event deleted successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Error deleting event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      date: '',
      duration: '',
      maxAttendees: '',
      eventType: '',
      category: '',
      tags: '',
      imageUrl: ''
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Event Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create New Event
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-2xl w-full m-4 max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Event Type *</label>
                  <select
                    required
                    value={formData.eventType}
                    onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Type</option>
                    {eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Max Attendees</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxAttendees}
                    onChange={(e) => setFormData({...formData, maxAttendees: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g. organic, workshop, beginner-friendly"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No events found. Create your first event!</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow p-6 border">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{event.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-500">
                    <div>📅 {new Date(event.date).toLocaleString()}</div>
                    <div>📍 {event.location}</div>
                    <div>👥 {event.currentAttendees}/{event.maxAttendees || '∞'} attendees</div>
                    <div>🏷️ {event.eventType}</div>
                    <div>📂 {event.category}</div>
                    {event.duration && <div>⏱️ {event.duration} minutes</div>}
                  </div>
                  {event.tags.length > 0 && (
                    <div className="mt-2">
                      {event.tags.map((tag, index) => (
                        <span key={index} className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mr-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {event.adminNotes && (
                    <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400">
                      <p className="text-sm text-yellow-800">
                        <strong>Admin Notes:</strong> {event.adminNotes}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(event)}
                    disabled={event.status === 'REJECTED'}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
