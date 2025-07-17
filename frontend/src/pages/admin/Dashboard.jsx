// src/pages/Admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';

const Dashboard = () => {
  const { axios } = useAppContext();
  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: [],
  });

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboard');
      if (data.success) {
        setDashboardData({
          blogs: data.blogs || 0,
          comments: data.comments || 0,
          drafts: data.drafts || 0,
          recentBlogs: data.recentBlogs || [],
        });
      } else {
        toast.error(data.message || 'Failed to fetch dashboard');
      }
    } catch (error) {
      toast.error('Failed to fetch dashboard');
    }
  };

  const handleTogglePublish = async (blogId) => {
    try {
      const { data } = await axios.put(`/api/admin/blog/${blogId}/toggle`);
      if (data.success) {
        toast.success(data.message);
        fetchDashboard();
      } else {
        toast.error(data.message || 'Failed to toggle status');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Toggle failed');
    }
  };

  const handleDelete = async (blogId) => {
    const confirm = window.confirm('Are you sure you want to delete this blog?');
    if (!confirm) return;

    try {
      const { data } = await axios.delete(`/api/admin/blog/${blogId}`);
      if (data.success) {
        toast.success(data.message);
        fetchDashboard();
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className='flex-1 p-4 md:p-10 bg-blue-50/50'>
      <div className='flex flex-wrap gap-4 mb-10'>
        <Card icon={assets.dashboard_icon_1} title="Blogs" count={dashboardData.blogs} />
        <Card icon={assets.dashboard_icon_2} title="Comments" count={dashboardData.comments} />
        <Card icon={assets.dashboard_icon_3} title="Drafts" count={dashboardData.drafts} />
      </div>

      <div className='bg-white rounded shadow p-4'>
        <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'>
          <img src={assets.dashboard_icon_4} alt='Latest Blogs' className='w-5 h-5' />
          Latest Blogs
        </h2>

        <table className='w-full text-left text-sm'>
          <thead className='border-b border-gray-200'>
            <tr className='text-gray-500'>
              <th className='py-2'>#</th>
              <th>BLOG TITLE</th>
              <th>DATE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.recentBlogs.length > 0 ? (
              dashboardData.recentBlogs.map((blog, index) => (
                <tr key={blog._id} className='border-b hover:bg-gray-50'>
                  <td className='py-3'>{index + 1}</td>
                  <td className='py-3'>{blog.title}</td>
                  <td className='py-3'>{new Date(blog.createdAt).toDateString()}</td>
                  <td className='py-3 text-green-500 font-medium'>
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </td>
                  <td className='py-3'>
                    <button
                      onClick={() => handleTogglePublish(blog._id)}
                      className='px-3 py-1 border rounded text-sm mr-2 hover:bg-gray-100'
                    >
                      {blog.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className='px-2 py-1 bg-red-100 text-red-600 rounded-full text-sm hover:bg-red-200'
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='5' className='text-center text-gray-400 py-4'>
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Card = ({ icon, title, count }) => (
  <div className='flex items-center gap-4 bg-white p-4 min-w-56 rounded shadow cursor-pointer hover:scale-105 transition-all'>
    <img src={icon} alt={title} />
    <div>
      <p className='text-xl font-semibold text-gray-600'>{count}</p>
      <p className='text-gray-400 font-light'>{title}</p>
    </div>
  </div>
);

export default Dashboard;
