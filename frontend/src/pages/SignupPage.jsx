import React, { useState } from 'react';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Signing up with:", email, password);
  }

  return (
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
              <a href="/login" className="text-blue-500 hover:underline">Log in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
