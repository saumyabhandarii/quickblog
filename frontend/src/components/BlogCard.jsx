import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    const clean = text.replace(/<[^>]+>/g, '');
    return clean.length > maxLength
      ? clean.slice(0, clean.lastIndexOf(' ', maxLength)) + '...'
      : clean;
  };

  return (
    <div
      onClick={() => navigate(`/blog/${blog._id}`)}
      role="button"
      aria-label={`Read blog: ${blog.title}`}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 transform hover:scale-105 cursor-pointer"
    >
      <img
        src={blog.image || "/uploads/default-blog.png"}
        alt={blog.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold text-white rounded-full mb-3 ${getCategoryColor(
            blog.category
          )}`}
        >
          {blog.category}
        </span>

        <h2 className="text-lg font-semibold mb-1">{blog.title}</h2>
        <p className="text-sm text-gray-600">
          {truncateText(blog.content)}
        </p>
      </div>
    </div>
  );
};

const getCategoryColor = (category) => {
  switch (category?.toLowerCase()) {
    case 'technology':
      return 'bg-purple-500';
    case 'lifestyle':
      return 'bg-pink-500';
    case 'finance':
      return 'bg-indigo-500';
    case 'startup':
      return 'bg-blue-500';
    default:
      return 'bg-gray-400';
  }
};

export default BlogCard;
