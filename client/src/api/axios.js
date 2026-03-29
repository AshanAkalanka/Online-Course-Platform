import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api'
});
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getErrorMessage = (error) => {
    return error?.response?.data?.message || 'Something went wrong';
};

export default instance;