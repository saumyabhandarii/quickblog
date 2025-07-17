import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom'; // ✅ include useLocation

const Login = () => {
  const { axios, setToken } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // ✅ get current location

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post('/api/admin/login', { email, password });

      if (data.success) {
        const token = data.token;

        setToken(token);
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        toast.success('Login successful!');

        // ✅ Redirect back to where user came from, or to home page
        const from = location.state?.from || '/';
        navigate(from, { replace: true });
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>
        <div className='flex flex-col items-center justify-center'>
          <div className='w-full py-6 text-center'>
            <h1 className='text-3xl font-bold'>
              <span className='text-primary'>Admin</span> Login
            </h1>
            <p className='font-light'>Enter your credentials to access the admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className='w-full'>
            <div className='flex flex-col'>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder='your email id'
                className='border-b-2 border-gray-300 p-2 outline-none mb-6'
              />
            </div>

            <div className='flex flex-col'>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder='your password'
                className='border-b-2 border-gray-300 p-2 outline-none mb-6'
              />
            </div>

            <button
              type="submit"
              className='w-full bg-primary text-white py-2 rounded-full font-medium mt-2'
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
