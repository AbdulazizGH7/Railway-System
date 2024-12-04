import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function BookingPage() {
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
    <div className="flex flex-col items-center justify-start space-y-6 mt-5">
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

      {/* Trips Table */}
      <table className="border-black border-solid border-2 table-auto w-10/12 text-left">
        <thead>
          <tr className="bg-gray-300">
            <th className="px-4 py-2">From</th>
            <th className="px-4 py-2">To</th>
            <th className="px-4 py-2">Train</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Departure Time</th>
            <th className="px-4 py-2">Arrival Time</th>
            <th className="px-4 py-2">Available Seats</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {filteredTrips.map((trip, index) => (
            <tr key={index} className="border-b odd:bg-slate-200 even:bg-slate-100">
              <td className="px-4 py-2">{trip.from}</td>
              <td className="px-4 py-2">{trip.to}</td>
              <td className="px-4 py-2">{trip.trainEng}</td>
              <td className="px-4 py-2">{trip.date}</td>
              <td className="px-4 py-2">{trip.departureTime}</td>
              <td className="px-4 py-2">{trip.arrivalTime}</td>
              <td className="px-4 py-2">{trip.availableSeats}</td>
              <td className="px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => handleReserveClick(trip)}
                >
                  Reserve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookingPage;
