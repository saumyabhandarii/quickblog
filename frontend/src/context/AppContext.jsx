// src/context/AppContext.jsx

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AppContext = createContext();

// ✅ Create a secure Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5000',
  withCredentials: true,
});

// ✅ Attach Authorization token dynamically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function AppProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState('');
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  // ✅ Save token in state and localStorage
  const handleSetToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  // ✅ Clear session on logout
  const handleLogout = () => {
    handleSetToken(null);
    if (location.pathname !== '/admin') {
      navigate('/admin');
    }
    toast.success('Logged out successfully.');
  };

  // ✅ Fetch blogs (admin protected)
  const fetchBlogs = async () => {
    try {
      setLoadingBlogs(true);

      const res = await axiosInstance.get('/api/admin/blogs');

      if (res.data.success && Array.isArray(res.data.blogs)) {
        setBlogs(res.data.blogs);
      } else {
        toast.error(res.data.message || 'Failed to fetch blogs.');
      }
    } catch (error) {
      console.error('❌ Error fetching blogs:', error);

      if (error.response?.status === 401) {
        toast.error('Unauthorized. Please login again.');
        handleLogout();
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Network error: Cannot connect to server.');
      } else {
        toast.error(error.response?.data?.message || 'Unknown error occurred.');
      }
    } finally {
      setLoadingBlogs(false);
    }
  };

  // ✅ Global context value
  const value = useMemo(
    () => ({
      axios: axiosInstance,
      navigate,
      token,
      setToken: handleSetToken,
      logout: handleLogout,
      blogs,
      setBlogs,
      input,
      setInput,
      fetchBlogs,
      loadingBlogs,
    }),
    [token, blogs, input, loadingBlogs]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ✅ Custom hook for easier usage
function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export { AppProvider, useAppContext };
