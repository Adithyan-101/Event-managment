/**
 * Real Authentication Service
 * Connects to Backend API
 */

const STORAGE_KEY = 'ces_auth_user';

export const authService = {
    // Login with Email & Password
    login: async (email, password) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
    },

    // Register new User
    register: async (userData) => {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        // Auto login (backend returns user object similar to login)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
    },

    logout: () => {
        localStorage.removeItem(STORAGE_KEY);
        window.location.href = '/login';
    },

    getCurrentUser: () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    // Admin: Get all users (if implemented in backend, currently not, but keeping placeholder or removing)
    // NOTE: Backend needs /api/users endpoint for this. I'll omit for now or leave as empty/error.
    getAllUsers: async () => {
        // Placeholder: Ideally fetch from /api/users
        return [];
    },

    updateUser: async (userId, updates) => {
        // Placeholder
        return null;
    }
};
