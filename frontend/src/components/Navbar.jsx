import React from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const { navigate, token, logout } = useAppContext();

  const handlePrimaryClick = () => {
  if (token) {
    navigate('/admin/dashboard'); // ✅ Correct path
  } else {
    navigate('/admin'); // Login page
  }
};


  return (
    <div className='flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32'>
      {/* Logo */}
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className='w-32 sm:w-44 cursor-pointer'
      />

      {/* Right Side Buttons */}
      <div className='flex gap-4 items-center'>
        {/* Dashboard/Login Button */}
        <button
          onClick={handlePrimaryClick}
          className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-8 py-2.5 transition duration-300'
        >
          {token ? 'Dashboard' : 'Login'}
          <img src={assets.arrow} className='w-3' alt="arrow" />
        </button>

        {/* Logout Button (only if logged in) */}
        {token && (
          <button
            onClick={logout}
            className='text-sm text-red-600 font-medium hover:underline transition duration-200'
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
