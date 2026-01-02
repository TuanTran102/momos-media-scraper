import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const authClient = axios.create({
    baseURL: API_URL,
});

const publicClient = axios.create({
    baseURL: API_URL
});

export const fetchMediaItems = (params) => {
    return publicClient.get('/api/public/media', { params });
};
