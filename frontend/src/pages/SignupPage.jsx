import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import Spinner from '../components/Spinner'
import axios from 'axios'

const SignUpPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [nationalIdError, setNationalIdError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matchError, setMatchError] = useState(false)
  const {login} = useUser()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setNationalIdError(false)
    setEmailError(false)
    setMatchError(false)

    if (password !== confirmPassword) {
        setMatchError(true);
        return;
    }

    try {
      setLoading(true)
      const response = await axios.post('http://localhost:8000/api/auth/signup', {
          firstName,
          lastName,
          nationalId,
          email,
          password
      });

      // Registration successful
      login(response.data.user)
      setLoading(false)
      navigate('/home')
      
  } catch (error) {
      if (error.response) {
          // Server responded with an error
          const data = error.response.data;
          if (data.nationalIdTaken) {
              setNationalIdError(true);
          } else if (data.emailTaken) {
              setEmailError(true);
          } else {
              alert(data.message || 'Registration failed');
          }
      } else if (error.request) {
          // Request was made but no response received
          alert('No response from server. Please try again.');
      } else {
          // Error in request setup
          console.error('Error during registration:', error);
          alert('An error occurred during registration');
      }
    }
    finally{
      setLoading(false)
    }
  };
  
  const handleNationalIdChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 10 digits
    if (value.length <= 10 && /^\d*$/.test(value)) {
      setNationalId(value);
    }
  }

  return (
    <>
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('imageIcon/TrainSA.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="min-h-screen flex justify-center items-center relative z-10 px-6 flex-col md:flex-row">
        
        {/* Left Section: SignUp title and description */}
        <div className="w-full md:w-1/2 text-white flex flex-col justify-center items-center md:items-start mb-6 md:mb-0">
          <h1 className="text-5xl font-extrabold mb-4">Saudi Railway</h1>
          <p className="text-lg mb-8 text-balance text-center md:text-left">
            Join us to experience fast, reliable, and safe train services across the Kingdom.
            Sign up now to create an account and start managing your train operations.
          </p>
        </div>

        {/* Right Section: Sign Up Form */}
        <div className="w-full md:w-1/3 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-extrabold text-center text-blue-500 mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit}>

          <div className="mb-4">
              <label htmlFor="firstName" className="block text-gray-700 font-medium">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Enter your first name"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="lastName" className="block text-gray-700 font-medium">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Enter your last name"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="nationalId" className="block text-gray-700 font-medium">National ID</label>
              <input
                type="text"
                id="nationalId"
                value={nationalId}
                onChange={handleNationalIdChange}
                required
                pattern="\d{10}"
                maxLength="10"
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Enter your 10-digit national ID"
              />
              {nationalId.length > 0 && nationalId.length < 10 && (
                <p className="mt-1 text-sm text-red-500">National ID must be exactly 10 digits</p>
              )}
              {nationalIdError &&(
                <p className="mt-1 text-sm text-red-500">National ID is already registered!</p>
              )}
            </div>

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
              {emailError &&(
                <p className="mt-1 text-sm text-red-500">Email is already registered!</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Create a password"
              />
              {matchError &&(
                <p className="mt-1 text-sm text-red-500">Passwords do not match!</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Confirm your password"
              />
              {matchError &&(
                <p className="mt-1 text-sm text-red-500">Passwords do not match!</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200 transform hover:scale-105"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account? 
              <Link to={"/login"} className="text-blue-500 hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    <Spinner loading={loading}/>
    </>
  );
}

export default SignUpPage;
