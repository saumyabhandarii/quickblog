// src/pages/admin/ListBlog.jsx

import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const ListBlog = () => {
  const { axios, blogs, fetchBlogs } = useAppContext();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleTogglePublish = async (blog) => {
    try {
      const { data } = await axios.post('/api/blog/toggle-publish', {
        id: blog._id,
      });

      if (data.success) {
        toast.success(data.message);
        await fetchBlogs(); // Refresh blog list
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Toggle publish error:', error);
      toast.error(error.response?.data?.message || 'Request failed');
    }
  };

  const handleDeleteBlog = async (blog) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
    if (!confirmDelete) return;

    try {
      const { data } = await axios.post('/api/blog/delete', {
        id: blog._id,
      });

      if (data.success) {
        toast.success(data.message);
        await fetchBlogs(); // Refresh after deletion
      } else {
        toast.error(data.message || 'Failed to delete blog');
      }
    } catch (error) {
      console.error('Delete blog error:', error);
      toast.error(error.response?.data?.message || 'Request failed');
    }
  };

  return (
    <div className="p-4 md:p-10 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">All Blogs</h2>

      <div className="bg-white rounded shadow overflow-x-auto">
        {blogs.length === 0 ? (
          <p className="p-4 text-gray-500">No blogs available.</p>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="border-b text-gray-600 bg-gray-100">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3 max-sm:hidden">Date</th>
                <th className="px-4 py-3 max-sm:hidden">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, index) => {
                const blogDate = new Date(blog.createdAt);
                return (
                  <tr key={blog._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{blog.title}</td>
                    <td className="px-4 py-3 max-sm:hidden">{blogDate.toDateString()}</td>
                    <td className="px-4 py-3 max-sm:hidden">
                      <span className={blog.isPublished ? 'text-green-600' : 'text-orange-600'}>
                        {blog.isPublished ? 'Published' : 'Unpublished'}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex flex-wrap gap-2 text-sm">
                      <button
                        onClick={() => handleTogglePublish(blog)}
                        className="border px-2 py-1 rounded hover:bg-gray-100"
                      >
                        {blog.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog)}
                        className="bg-red-100 text-red-600 px-2 py-1 rounded-full hover:bg-red-200"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ListBlog;
