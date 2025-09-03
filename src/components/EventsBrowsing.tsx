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
  organizer: {
    id: string;
    name: string;
    email: string;
    farmerProfile?: {
      farmName: string;
      farmAddress: string;
      certificationBadge?: string;
    };
  };
  attendees: Array<{
    id: string;
    userId: string;
    user: {
      id: string;
      name: string;
    };
  }>;
  _count: {
    attendees: number;
  };
  createdAt: string;
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

export default function EventsBrowsing({ userId }: { userId?: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    eventType: '',
    upcoming: true
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userRegistrations, setUserRegistrations] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.eventType) params.append('eventType', filters.eventType);
      if (filters.upcoming) params.append('upcoming', 'true');

      const response = await fetch(`/api/events?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        
        // Check user registrations
        if (userId) {
          const registrations = new Set<string>();
          data.forEach((event: Event) => {
            const userRegistered = event.attendees.some(attendee => 
              attendee.user.id === userId
            );
            if (userRegistered) {
              registrations.add(event.id);
            }
          });
          setUserRegistrations(registrations);
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (eventId: string) => {
    if (!userId) {
      alert('Please login to register for events');
      return;
    }

    try {
      const isRegistered = userRegistrations.has(eventId);
      const method = isRegistered ? 'DELETE' : 'POST';
      
      let response;
      if (isRegistered) {
        // Unregister
        response = await fetch(`/api/events/${eventId}?userId=${userId}`, {
          method: 'DELETE'
        });
      } else {
        // Register
        response = await fetch(`/api/events/${eventId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId })
        });
      }

      if (response.ok) {
        fetchEvents();
        alert(isRegistered ? 'Successfully unregistered from event!' : 'Successfully registered for event!');
      } else {
        const error = await response.json();
        alert(error.error || 'Error with registration');
      }
    } catch (error) {
      console.error('Error with registration:', error);
      alert('Error with registration');
    }
  };

  const openEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const isEventFull = (event: Event): boolean => {
    return !!(event.maxAttendees && event.currentAttendees >= event.maxAttendees);
  };

  const isEventPast = (event: Event) => {
    return new Date(event.date) < new Date();
  };

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Farmer Events & Workshops</h1>
        <p className="text-gray-600">Connect with fellow farmers through knowledge-sharing events, workshops, and meetups.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              placeholder="Search events..."
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Event Type</label>
            <select
              value={filters.eventType}
              onChange={(e) => setFilters({...filters, eventType: e.target.value})}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All Types</option>
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.upcoming}
                onChange={(e) => setFilters({...filters, upcoming: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm">Upcoming only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No events found matching your criteria.</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow border hover:shadow-lg transition-shadow">
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold flex-1">{event.title}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded ml-2">
                    {event.eventType}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <span className="mr-2">📅</span>
                    {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📍</span>
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">👥</span>
                    {event.currentAttendees}/{event.maxAttendees || '∞'} attendees
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🏷️</span>
                    {event.category}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium mb-1">Organized by:</div>
                  <div className="text-sm text-gray-600">
                    {event.organizer.farmerProfile?.farmName || event.organizer.name}
                    {event.organizer.farmerProfile?.certificationBadge && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {event.organizer.farmerProfile.certificationBadge}
                      </span>
                    )}
                  </div>
                </div>

                {event.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                      {event.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{event.tags.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => openEventDetails(event)}
                    className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded hover:bg-gray-200 text-sm"
                  >
                    View Details
                  </button>
                  
                  {!isEventPast(event) && (
                    <button
                      onClick={() => handleRegistration(event.id)}
                      disabled={!userRegistrations.has(event.id) && isEventFull(event)}
                      className={`py-2 px-4 rounded text-sm ${
                        userRegistrations.has(event.id)
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : isEventFull(event)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {userRegistrations.has(event.id)
                        ? 'Unregister'
                        : isEventFull(event)
                        ? 'Full'
                        : 'Register'
                      }
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Event Details Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full m-4 max-h-screen overflow-y-auto">
            {selectedEvent.imageUrl && (
              <img
                src={selectedEvent.imageUrl}
                alt={selectedEvent.title}
                className="w-full h-64 object-cover rounded-t-lg"
              />
            )}
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold flex-1">{selectedEvent.title}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 ml-4"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700">{selectedEvent.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-3">Event Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">📅 Date:</span> {new Date(selectedEvent.date).toLocaleString()}</div>
                    <div><span className="font-medium">📍 Location:</span> {selectedEvent.location}</div>
                    <div><span className="font-medium">🏷️ Type:</span> {selectedEvent.eventType}</div>
                    <div><span className="font-medium">📂 Category:</span> {selectedEvent.category}</div>
                    {selectedEvent.duration && (
                      <div><span className="font-medium">⏱️ Duration:</span> {selectedEvent.duration} minutes</div>
                    )}
                    <div><span className="font-medium">👥 Attendees:</span> {selectedEvent.currentAttendees}/{selectedEvent.maxAttendees || '∞'}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Organizer</h4>
                  <div className="text-sm">
                    <div className="font-medium">{selectedEvent.organizer.farmerProfile?.farmName || selectedEvent.organizer.name}</div>
                    <div className="text-gray-600">{selectedEvent.organizer.email}</div>
                    {selectedEvent.organizer.farmerProfile && (
                      <>
                        <div className="text-gray-600">{selectedEvent.organizer.farmerProfile.farmAddress}</div>
                        {selectedEvent.organizer.farmerProfile.certificationBadge && (
                          <span className="inline-block mt-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            {selectedEvent.organizer.farmerProfile.certificationBadge}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {selectedEvent.tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!isEventPast(selectedEvent) && (
                <div className="flex justify-end">
                  <button
                    onClick={() => handleRegistration(selectedEvent.id)}
                    disabled={!userRegistrations.has(selectedEvent.id) && isEventFull(selectedEvent)}
                    className={`py-2 px-6 rounded ${
                      userRegistrations.has(selectedEvent.id)
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : isEventFull(selectedEvent)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {userRegistrations.has(selectedEvent.id)
                      ? 'Unregister from Event'
                      : isEventFull(selectedEvent)
                      ? 'Event is Full'
                      : 'Register for Event'
                    }
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
