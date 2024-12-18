import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import Spinner from '../components/Spinner'
import axios from 'axios'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useUser(); 
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        email,
        password
      });
  
      // Login successful
      login(response.data.user)
      setLoading(false)
      navigate('/home')

    } catch (error) {
      if (error.response) {
        // Server responded with an error
        setError(error.response.data.error || 'Login failed');
      } else if (error.request) {
        // Request was made but no response received
        setError('No response from server. Please try again.');
      } else {
        // Error in request setup
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('imageIcon/TrainSA.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="min-h-screen flex justify-center items-center relative z-10 px-6 flex-col md:flex-row">
        
        {/* Left Section: Saudi Railway title and description */}
        <div className="w-full md:w-1/2 text-white flex flex-col justify-center items-center md:items-start mb-6 md:mb-0">
          <h1 className="text-5xl font-extrabold mb-4">Saudi Railway</h1>
          <p className="text-lg mb-8 text-balance text-center md:text-left">
            Where we aim to provide fast, reliable, and safe train services connecting cities across the Kingdom.
            Log in to access your account and manage train operations.
          </p>
        </div>

        {/* Right Section: Login Form */}
        <div className="w-full md:w-1/3 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-extrabold text-center text-blue-500 mb-6">Login</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200 transform hover:scale-105"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account? 
              <Link to={"/signup"} className="text-blue-500 hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
