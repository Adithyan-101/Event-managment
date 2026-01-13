/**
 * Mock Authentication Service
 * Simulates login, registration, and user session management using localStorage.
 */

const STORAGE_KEY = 'ces_auth_user';
const USERS_KEY = 'ces_users';

// Initial Mock Users (only loaded if storage is empty)
const INITIAL_USERS = [
    { id: 's1', name: 'John Doe', email: 'john@college.edu', password: 'password', role: 'student', isVolunteer: false },
    { id: 's2', name: 'Jane Smith', email: 'jane@college.edu', password: 'password', role: 'student', isVolunteer: false },
    { id: 'c1', name: 'Tech Club Admin', email: 'tech@clubs.edu', password: 'password', role: 'club_admin', clubName: 'Tech Club' },
    { id: 'c2', name: 'Art Club Admin', email: 'art@clubs.edu', password: 'password', role: 'club_admin', clubName: 'Art Club' },
    { id: 'a1', name: 'College Administrator', email: 'admin@college.edu', password: 'password', role: 'college_admin' }
];

const getUsers = () => {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) {
        localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
        return INITIAL_USERS;
    }
    return JSON.parse(stored);
};

const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
    // Login with Email & Password
    login: async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = getUsers();
                const user = users.find(u => u.email === email && u.password === password);
                if (user) {
                    const { password, ...userWithoutPass } = user;
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPass));
                    resolve(userWithoutPass);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 500);
        });
    },

    // Register new User
    register: async (userData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = getUsers();
                if (users.some(u => u.email === userData.email)) {
                    reject(new Error('Email already exists'));
                    return;
                }

                const newUser = {
                    id: 'u' + Date.now(),
                    ...userData,
                    isVolunteer: false // Default
                };

                users.push(newUser);
                saveUsers(users);

                // Auto login after register
                const { password, ...userWithoutPass } = newUser;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPass));
                resolve(userWithoutPass);
            }, 500);
        });
    },

    logout: () => {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
    },

    getCurrentUser: () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        // Refresh user data from DB to get latest status (e.g. volunteer promotion)
        const sessionUser = JSON.parse(stored);
        const users = getUsers();
        const freshUser = users.find(u => u.id === sessionUser.id);

        if (freshUser) {
            const { password, ...userWithoutPass } = freshUser;
            // Update session if changed
            if (JSON.stringify(userWithoutPass) !== JSON.stringify(sessionUser)) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPass));
            }
            return userWithoutPass;
        }
        return sessionUser; // Fallback
    },

    // For Admin Management
    getAllUsers: () => getUsers(),

    updateUser: (userId, updates) => {
        const users = getUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index > -1) {
            users[index] = { ...users[index], ...updates };
            saveUsers(users);
            return users[index];
        }
        return null;
    }
};
