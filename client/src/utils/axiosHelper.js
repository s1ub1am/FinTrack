import axios from 'axios';

const api = axios.create({
    baseURL: 'https://backend-production-a36e.up.railway.app/api',
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['auth-token'] = token;
    }
    return config;
});

export default api;
