import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.29.151:5000/api',
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['auth-token'] = token;
    }
    return config;
});

export default api;
