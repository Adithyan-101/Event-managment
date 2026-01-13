/**
 * Mock Event Service
 * Manages event creation, listing, and approval.
 */

const EVENTS_KEY = 'ces_events';

// Initial Mock Events
const INITIAL_EVENTS = [
    {
        id: 'e1',
        title: 'Intro to React',
        description: 'Learn the basics of React JS.',
        date: '2025-01-10T14:00',
        capacity: 50,
        clubId: 'c1',
        clubName: 'Tech Club',
        status: 'approved',
        createdAt: new Date().toISOString()
    },
    {
        id: 'e2',
        title: 'Abstract Painting Workshop',
        description: 'Express yourself through colors.',
        date: '2025-01-15T10:00',
        capacity: 20,
        clubId: 'c2',
        clubName: 'Art Club',
        status: 'pending',
        createdAt: new Date().toISOString()
    }
];

// Helper to get events from storage
const getStoredEvents = () => {
    const stored = localStorage.getItem(EVENTS_KEY);
    if (!stored) {
        localStorage.setItem(EVENTS_KEY, JSON.stringify(INITIAL_EVENTS));
        return INITIAL_EVENTS;
    }
    return JSON.parse(stored);
};

export const eventService = {
    createEvent: async (eventData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const events = getStoredEvents();
                const newEvent = {
                    ...eventData,
                    id: 'e' + Date.now(),
                    status: 'pending',
                    createdAt: new Date().toISOString()
                };
                events.push(newEvent);
                localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
                resolve(newEvent);
            }, 500);
        });
    },

    getAllEvents: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(getStoredEvents());
            }, 300);
        });
    },

    getApprovedEvents: async () => {
        const events = await eventService.getAllEvents();
        return events.filter(e => e.status === 'approved');
    },

    getClubEvents: async (clubId) => {
        const events = await eventService.getAllEvents();
        return events.filter(e => e.clubId === clubId);
    },

    updateEventStatus: async (eventId, status) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const events = getStoredEvents();
                const eventIndex = events.findIndex(e => e.id === eventId);
                if (eventIndex > -1) {
                    events[eventIndex].status = status;
                    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
                    resolve(events[eventIndex]);
                } else {
                    resolve(null);
                }
            }, 300);
        });
    },

    getEventById: async (eventId) => {
        const events = await eventService.getAllEvents();
        return events.find(e => e.id === eventId);
    }
};
