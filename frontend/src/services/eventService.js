/**
 * Real Event Service
 * Connects to Backend API
 */

export const eventService = {
    createEvent: async (eventData) => {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    },

    getAllEvents: async () => {
        const response = await fetch('/api/events');
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    },

    getApprovedEvents: async () => {
        const events = await eventService.getAllEvents();
        return events.filter(e => e.status === 'approved'); // Backend currently returns all, filter here or valid backend query
    },

    getClubEvents: async (clubId) => {
        // Backend doesn't strictly support clubId filter yet, or it's in the object.
        const events = await eventService.getAllEvents();
        // Assuming clubId matches organizer logic or just filtering fields
        return events.filter(e => e.clubId === clubId);
    },

    updateEventStatus: async (eventId, status) => {
        const response = await fetch(`/api/events/${eventId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
    },

    getEventById: async (eventId) => {
        // Optimally backend should have /api/events/:id, but finding in list works for small apps
        const events = await eventService.getAllEvents();
        return events.find(e => e._id === eventId || e.id === eventId);
    }
};
