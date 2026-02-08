import axios from 'axios';

// Prefer explicit Vite dev mode when available, else fallback to hostname check
const getBaseURL = () => {
    try {
        // Vite provides import.meta.env.DEV
        // eslint-disable-next-line no-undef
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
            return 'http://localhost:5000/api';
        }
    } catch (e) { }

    if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        if (host === 'localhost' || host === '127.0.0.1') {
            return 'http://localhost:5000/api';
        }
    }

    return 'https://backend-production-a36e.up.railway.app/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['auth-token'] = token;
        // Also set Authorization header as a fallback/standard
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Optional: Redirect to login
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
