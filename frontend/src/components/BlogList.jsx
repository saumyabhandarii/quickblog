import React, { useState, useEffect } from 'react';
import { blogCategories } from '../assets/assets';
import { motion } from "framer-motion";
import BlogCard from './BlogCard';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const { blogs, input, fetchBlogs } = useAppContext();
  const location = useLocation();

  // ✅ Re-fetch blogs on route change (e.g., after adding blog and redirecting to '/')
  useEffect(() => {
    fetchBlogs();
  }, [location]);

  const filteredBlogs = () => {
    if (input === '') return blogs;
    return blogs.filter((blog) =>
      blog.title.toLowerCase().includes(input.toLowerCase()) ||
      blog.category.toLowerCase().includes(input.toLowerCase())
    );
  };

  return (
    <div className="mt-10">
      {/* Category Tabs */}
      <div className='flex justify-center gap-4 sm:gap-8 my-10 relative'>
        {blogCategories.map((item) => (
          <div key={item} className='relative'>
            <button
              onClick={() => setMenu(item)}
              className={`cursor-pointer text-gray-600 px-4 py-1 text-sm sm:text-base rounded-full transition-colors duration-300
                ${menu === item ? 'bg-primary text-white' : 'hover:bg-blue-600 hover:text-white'}
              `}
            >
              {item}
              {menu === item && (
                <motion.div
                  layoutId='underline'
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className='absolute left-0 right-0 top-0 h-full -z-10 bg-primary rounded-full'
                />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Blog Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40'>
        {filteredBlogs()
          .filter(blog => menu === "All" || blog.category === menu)
          .map(blog => (
            <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default BlogList;
