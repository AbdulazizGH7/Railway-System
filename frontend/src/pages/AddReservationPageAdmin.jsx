import React, { useState, useEffect } from "react";
import { FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function AddReservationPageAdmin() {
  const [numSeats, setNumSeats] = useState(1);
  const [dependents, setDependents] = useState([{ firstName: "", lastName: "" }]);
  const [firstName, setFirstName] = useState(""); // State for first name
  const [lastName, setLastName] = useState(""); // State for last name
  const [nationalId, setNationalId] = useState(""); // State for National ID
  const [errors, setErrors] = useState({});
  const [reservationStatus, setReservationStatus] = useState(""); // To track reservation status
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    // Update dependents array when numSeats changes
    const updatedDependents = Array.from({ length: numSeats - 1 }, (_, index) => ({
      firstName: "",
      lastName: "",
    }));
    setDependents(updatedDependents);
  }, [numSeats]);

  const handleReservationSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validate National ID (should be 10 digits)
    if (!nationalId || nationalId.length !== 10) {
      newErrors.nationalId = "National ID is required and should be 10 digits.";
    }

    // Validate first name and last name
    if (!firstName) {
      newErrors.firstName = "First name is required.";
    }
    if (!lastName) {
      newErrors.lastName = "Last name is required.";
    }

    // Validate numSeats
    if (numSeats < 1) {
      newErrors.numSeats = "Please select at least one seat.";
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

    // Simulate reservation status
    setReservationStatus("Reservation is pending...");

    // Simulate a delay (e.g., API call) and then update the status to "Confirmed"
    setTimeout(() => {
      setReservationStatus("Reservation Confirmed!");
      alert(`Reservation is pending! ${numSeats} seat(s) reserved.`);

      // Navigate back to the Reservations page after reservation is confirmed
      navigate("/reservations"); // Replace "/reservations" with your actual route path
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
          Add Reservation for Admin
        </h2>

        <form onSubmit={handleReservationSubmit} className="space-y-6">
          {/* National ID */}
          <div className="space-y-2">
            <label htmlFor="nationalId" className="block text-lg font-medium text-gray-700">
              National ID
            </label>
            <input
              type="text"
              id="nationalId"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              maxLength="10"
              required
              className="w-full px-4 py-3 border rounded-lg text-lg transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none transform hover:scale-105 duration-200"
            />
            {errors.nationalId && <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>}
          </div>

          {/* First Name */}
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-lg font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg text-lg transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none transform hover:scale-105 duration-200"
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-lg font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg text-lg transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none transform hover:scale-105 duration-200"
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>

          {/* Number of Seats */}
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
            Add Reservation
          </button>
        </form>

        {/* Reservation Status Message */}
        {reservationStatus && (
          <div className="mt-6 text-center text-xl font-medium text-gray-800">
            {reservationStatus}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddReservationPageAdmin;
