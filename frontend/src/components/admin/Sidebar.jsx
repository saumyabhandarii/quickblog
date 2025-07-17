import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Sidebar = () => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${
      isActive ? 'bg-primary/10 border-r-4 border-primary' : ''
    }`;

  return (
    <div className="bg-white border-r h-full w-full md:w-64">
      {/* ✅ Fixed Dashboard path */}
      <NavLink to="/admin/dashboard" className={navLinkClass}>
        <img src={assets.home_icon} alt="Dashboard" className="min-w-4 w-5" />
        <p className="hidden md:inline-block">Dashboard</p>
      </NavLink>

      <NavLink to="/admin/addBlog" className={navLinkClass}>
        <img src={assets.add_icon} alt="Add Blog" className="min-w-4 w-5" />
        <p className="hidden md:inline-block">Add Blog</p>
      </NavLink>

      <NavLink to="/admin/ListBlog" className={navLinkClass}>
        <img src={assets.list_icon} alt="List Blog" className="min-w-4 w-5" />
        <p className="hidden md:inline-block">List Blog</p>
      </NavLink>

      <NavLink to="/admin/comments" className={navLinkClass}>
        <img src={assets.comment_icon} alt="Comments" className="min-w-4 w-5" />
        <p className="hidden md:inline-block">Comments</p>
      </NavLink>
    </div>
  );
};

export default Sidebar;
