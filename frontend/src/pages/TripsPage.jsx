import React, { useState, useMemo,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaSearch, 
} from 'react-icons/fa';

import axios from 'axios';
import SearchPanel from "../components/SearchPanel";
import trainService from "../components/trainService";
import TripCard from "../components/TripCard";





function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await trainService.getAllTrains();
      setTrips(data); // This will now receive data.response from the service
      setFilteredTrips(data); // This will now receive data.response from the service
    } catch (err) {
      setError('Failed to fetch trips');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cities = useMemo(() => 
    [...new Set(trips.map(trip => trip.from))],
    [trips]
  );

  const availableDestinations = useMemo(() => {
    if (!fromCity) return [];
    return [...new Set(
      trips
        .filter(trip => trip.from === fromCity)
        .map(trip => trip.to)
    )];
  }, [trips, fromCity]);

  const handleSearch = () => {
    setIsSearching(true);
    const filtered = trips.filter((trip) => {
      const fromMatch = !fromCity || trip.from === fromCity;
      const toMatch = !toCity || trip.to === toCity;
      const dateMatch = !selectedDate || trip.date === selectedDate;
      return fromMatch && toMatch && dateMatch;
    });
    setFilteredTrips(filtered);
  };

  const handleReserve = (trip) => {
    navigate("/reserve", { state: { trip } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trips...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={fetchTrips}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-800 p-8">
      <div className="max-w-6xl mx-auto">
        <SearchPanel 
          fromCity={fromCity}
          setFromCity={setFromCity}
          toCity={toCity}
          setToCity={setToCity}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          cities={cities}
          availableDestinations={availableDestinations}
          onSearch={handleSearch}
        />

        <div className="space-y-4">
          {isSearching && filteredTrips.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
              <FaSearch className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500">No trips found matching your criteria</p>
            </div>
          ) : (
            filteredTrips.map((trip, index) => (<TripCard 
              key={index} 
              trip={trip}
            />
          ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TripsPage;