import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';

import Navbar from './components/Navbar';
import axios from 'axios';

import Layout from './pages/admin/Layout';
import Dashboard from './pages/admin/Dashboard';
import AddBlog from './pages/admin/AddBlog';
import ListBlog from './pages/admin/ListBlog';
import Comments from './pages/admin/Comments';
import Login from './components/admin/Login';

import 'quill/dist/quill.snow.css';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';

const App = () => {
  const { token } = useAppContext();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />

        {/* Admin Routes */}
        <Route path="/admin" element={token ? <Layout /> : <Login />}>
          {/* Redirect /admin to /admin/dashboard */}
          <Route index element={<Navigate to="/" />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="addblog" element={<AddBlog />} />
          <Route path="listblog" element={<ListBlog />} />
          <Route path="comments" element={<Comments />} />
        </Route>

        {/* Optional: Catch-all route */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </>
  );
};

export default App;
