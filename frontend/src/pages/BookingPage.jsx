import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiUsers } from "react-icons/fi";

function BookingPage() {
  const { state } = useLocation(); // Get the selected trip passed from BookingPage
  const navigate = useNavigate();

  const [numSeats, setNumSeats] = useState(1);
  const [dependents, setDependents] = useState([{ firstName: "", lastName: "" }]);
  const [errors, setErrors] = useState({});
  const [bookingStatus, setBookingStatus] = useState(""); // New state to track booking status

  useEffect(() => {
    // Update dependents array when numSeats changes
    const updatedDependents = Array.from({ length: numSeats - 1 }, (_, index) => ({
      firstName: "",
      lastName: "",
    }));
    setDependents(updatedDependents);
  }, [numSeats]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validate numSeats
    if (numSeats < 1 || numSeats > state.trip.availableSeats) {
      newErrors.numSeats = `Select between 1 and ${state.trip.availableSeats} seats.`;
    }

    // Validate dependents if seats > 1
    if (numSeats > 1) {
      dependents.forEach((dep, index) => {
        if (!dep.firstName || !dep.lastName) {
          newErrors[`dependent${index + 2}`] = "Both first and last names are required.";
        }
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop form submission if errors
    }

    // Set booking status to "Pending" while simulating booking process
    setBookingStatus("Booking is pending...");

    // Simulate a delay (e.g., API call) and then update the status to "Confirmed"
    setTimeout(() => {
      setBookingStatus("pending Booking!");
      alert(`Booking is pending! ${numSeats} seat(s) reserved on ${state.trip.trainEng}.`);
      navigate("/"); // Navigate back after booking
    }, 2000); // Simulating a 2-second delay
  };

  const handleDependentChange = (index, field, value) => {
    const updatedDependents = [...dependents];
    updatedDependents[index][field] = value;
    setDependents(updatedDependents);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white py-10 px-4">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-2xl transition-all transform hover:scale-105 duration-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Reserve Your Seats for {state.trip.trainEng}
        </h2>

        <form onSubmit={handleBookingSubmit} className="space-y-6">
          {/* Seats */}
          <div className="space-y-2">
            <label htmlFor="numSeats" className="block text-lg font-medium text-gray-700">
              <FiUsers className="inline-block mr-2 text-blue-600" /> Number of Seats
            </label>
            <input
              type="number"
              id="numSeats"
              value={numSeats}
              onChange={(e) => setNumSeats(parseInt(e.target.value))}
              min="1"
              max={state.trip.availableSeats}
              required
              className="w-full px-4 py-3 border rounded-lg text-lg transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none transform hover:scale-105 duration-200"
            />
            {errors.numSeats && <p className="text-red-500 text-sm mt-1">{errors.numSeats}</p>}
          </div>

          {/* Dependents Information */}
          {numSeats > 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-800">Dependents Information</h3>
              {dependents.map((dependent, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      placeholder={`Dependent ${index + 1} First Name`}
                      value={dependent.firstName}
                      onChange={(e) =>
                        handleDependentChange(index, "firstName", e.target.value)
                      }
                      className="w-full px-4 py-3 border rounded-lg text-lg transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none transform hover:scale-105 duration-200"
                    />
                    <input
                      type="text"
                      placeholder={`Dependent ${index + 1} Last Name`}
                      value={dependent.lastName}
                      onChange={(e) =>
                        handleDependentChange(index, "lastName", e.target.value)
                      }
                      className="w-full px-4 py-3 border rounded-lg text-lg transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none transform hover:scale-105 duration-200"
                    />
                  </div>
                  {errors[`dependent${index + 2}`] && (
                    <p className="text-red-500 text-sm">{errors[`dependent${index + 2}`]}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-lg py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 duration-200"
          >
            Pending Booking
          </button>
        </form>

        {/* Booking Status Message */}
        {bookingStatus && (
          <div className="mt-6 text-center text-lg font-medium text-gray-800">
            {bookingStatus}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingPage;
