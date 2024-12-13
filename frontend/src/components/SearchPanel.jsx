import React from 'react';
import { 
    FaTrain, 
    FaSearch, 
    FaMapMarkerAlt, 
    FaClock, 
    FaCalendarAlt, 
    FaChair 
  } from 'react-icons/fa';
 
const SearchPanel = ({ 
    fromCity, 
    setFromCity, 
    toCity, 
    setToCity, 
    selectedDate, 
    setSelectedDate, 
    cities, 
    availableDestinations,
    onSearch 
  }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <FaTrain className="mr-2 text-blue-500" />
        Search Available Trips
      </h2>
    
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 font-medium flex items-center">
            <FaMapMarkerAlt className="mr-2 text-blue-500" />
            From
          </label>
          <select
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
          >
            <option value="">Select Departure</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
  
        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 font-medium flex items-center">
            <FaMapMarkerAlt className="mr-2 text-blue-500" />
            To
          </label>
          <select
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={toCity}
            onChange={(e) => setToCity(e.target.value)}
            disabled={!fromCity}
          >
            <option value="">Select Destination</option>
            {availableDestinations.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
  
        <div className="flex flex-col space-y-2">
          <label className="text-gray-700 font-medium flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-500" />
            Date
          </label>
          <input
            type="date"
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
  
        <div className="flex items-end">
          <button
            onClick={onSearch}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 
                     transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <FaSearch className="mr-2" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
  export default SearchPanel;