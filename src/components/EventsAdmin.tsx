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
    farmerProfile?: {
      farmName: string;
      farmAddress: string;
    };
  };
  _count: {
    attendees: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function EventsAdmin({ adminId }: { adminId: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const url = filter === 'ALL' ? `/api/admin/events?adminId=${adminId}` : `/api/admin/events?status=${filter}&adminId=${adminId}`;
      
      const response = await fetch(url);
      
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

  const handleStatusUpdate = async (eventId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          adminNotes: adminNotes,
          adminId: adminId
        })
      });

      if (response.ok) {
        fetchEvents();
        setShowModal(false);
        setSelectedEvent(null);
        setAdminNotes('');
        alert(`Event ${status.toLowerCase()} successfully!`);
      } else {
        const error = await response.json();
        alert(error.error || 'Error updating event status');
      }
    } catch (error) {
      console.error('Error updating event status:', error);
      alert('Error updating event status');
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/events/${eventId}?adminId=${adminId}`, {
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

  const openModal = (event: Event) => {
    setSelectedEvent(event);
    setAdminNotes(event.adminNotes || '');
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusStats = () => {
    const stats = {
      total: events.length,
      pending: events.filter(e => e.status === 'PENDING').length,
      approved: events.filter(e => e.status === 'APPROVED').length,
      rejected: events.filter(e => e.status === 'REJECTED').length
    };
    return stats;
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-700">Loading events...</div>;
  }

  const stats = getStatusStats();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Event Management</h1>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-600">Total Events</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-yellow-600">Pending Review</div>
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-green-600">Approved</div>
          </div>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-red-600">Rejected</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex space-x-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded border ${
                  filter === status
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-700">No events found for the selected filter.</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow border">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-700 mb-2">{event.description}</p>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <span className="font-medium mr-2 text-gray-700">📅 Date:</span>
                            {new Date(event.date).toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2 text-gray-700">📍 Location:</span>
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2 text-gray-700">👥 Attendees:</span>
                            {event.currentAttendees}/{event.maxAttendees || '∞'}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="space-y-1 text-sm text-gray-700">
                          <div><span className="font-medium">Type:</span> {event.eventType}</div>
                          <div><span className="font-medium">Category:</span> {event.category}</div>
                          {event.duration && <div><span className="font-medium">Duration:</span> {event.duration} minutes</div>}
                        </div>
                        
                        <div className="mt-3">
                          <div className="font-medium text-sm mb-1 text-gray-700">Organizer:</div>
                          <div className="text-sm text-gray-700">
                            <div>{event.organizer.name}</div>
                            <div>{event.organizer.email}</div>
                            {event.organizer.farmerProfile && (
                              <div className="text-xs text-gray-600">
                                {event.organizer.farmerProfile.farmName} - {event.organizer.farmerProfile.farmAddress}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {event.tags.length > 0 && (
                      <div className="mb-3">
                        <div className="text-sm font-medium mb-1 text-gray-700">Tags:</div>
                        <div className="flex flex-wrap gap-1">
                          {event.tags.map((tag, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {event.adminNotes && (
                      <div className="mt-3 p-3 bg-gray-50 border-l-4 border-gray-400 rounded">
                        <div className="text-sm font-medium mb-1 text-gray-700">Admin Notes:</div>
                        <div className="text-sm text-gray-700">{event.adminNotes}</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-6">
                    {event.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => openModal(event)}
                          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                        >
                          Review
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full m-4">
            <h2 className="text-xl font-bold mb-4">Review Event: {selectedEvent.title}</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">Admin Notes (optional)</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full border rounded px-3 py-2 text-gray-800 placeholder-gray-500"
                placeholder="Add notes about your decision..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedEvent.id, 'REJECTED')}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedEvent.id, 'APPROVED')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
