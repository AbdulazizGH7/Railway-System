import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrain, FaCalendarAlt, FaClock, FaChair } from "react-icons/fa";

function TripsPage() {
  const [trips, setTrips] = useState([
    {
      from: "Riyadh",
      to: "Jeddah",
      trainEng: "Express 101",
      date: "2024-12-04",
      departureTime: "08:00 AM",
      arrivalTime: "12:00 PM",
      availableSeats: 10,
    },
    {
      from: "Jeddah",
      to: "Mecca",
      trainEng: "Express 202",
      date: "2024-12-04",
      departureTime: "09:00 AM",
      arrivalTime: "10:00 AM",
      availableSeats: 20,
    },
    {
      from: "Dammam",
      to: "Riyadh",
      trainEng: "Express 303",
      date: "2024-12-05",
      departureTime: "06:00 AM",
      arrivalTime: "09:00 AM",
      availableSeats: 5,
    },
    {
      from: "Mecca",
      to: "Jeddah",
      trainEng: "Express 404",
      date: "2024-12-06",
      departureTime: "11:00 AM",
      arrivalTime: "12:00 PM",
      availableSeats: 15,
    },
  ]);

  const [selectedCity, setSelectedCity] = useState(""); // State for selected city
  const [selectedDate, setSelectedDate] = useState(""); // State for selected date
  const [selectedTrip, setSelectedTrip] = useState(null);

  const cities = ["Riyadh", "Jeddah", "Dammam", "Mecca"]; // Example cities
  const dates = ["2024-12-04", "2024-12-05", "2024-12-06"]; // Example dates

  const filteredTrips = trips.filter((trip) => {
    return (
      (!selectedCity || trip.from === selectedCity) &&
      (!selectedDate || trip.date === selectedDate)
    );
  });

  const navigate = useNavigate();

  const handleReserveClick = (trip) => {
    setSelectedTrip(trip);
    navigate("/reserve", { state: { trip: trip } });
  };

  return (
    <div className="flex flex-col items-center justify-start space-y-6 my-5">
      {/* Dropdown Menus */}
      <div className="flex justify-between items-center space-x-4 border-solid border-2 border-black w-10/12 p-2">
        {/* Departure City Dropdown */}
        <div>
          <label htmlFor="departure-city" className="mr-1">
            Departure City:
          </label>
          <select
            id="departure-city"
            className="border rounded px-4 py-2"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">All Cities</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Date Dropdown */}
        <div>
          <label htmlFor="departure-date" className="mr-1">
            Departure Date:
          </label>
          <input
            id="departure-date"
            type="date"
            className="border rounded px-4 py-2"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Trips Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-10/12">
        {filteredTrips.map((trip, index) => (
          <div
            key={index}
            className="flex flex-col bg-white rounded-xl p-6 shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-semibold">{trip.from} to {trip.to}</span>
                <FaTrain className="text-3xl text-blue-600" />
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <FaCalendarAlt className="text-blue-500" />
                <span>{trip.date}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <FaClock className="text-green-500" />
                <span>Departure: {trip.departureTime}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <FaClock className="text-red-500" />
                <span>Arrival: {trip.arrivalTime}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <FaChair className="text-yellow-500" />
                <span>{trip.availableSeats} Seats Available</span>
              </div>

              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-xl mt-4 text-lg font-semibold"
                onClick={() => handleReserveClick(trip)}
              >
                Reserve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TripsPage;
