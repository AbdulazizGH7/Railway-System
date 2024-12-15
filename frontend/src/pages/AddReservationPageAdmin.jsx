import React, { useState, useEffect } from "react";
import { FiUsers } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { useUser } from "../contexts/UserContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddReservationPageAdmin() {
  const { user } = useUser();
  const { trainId } = useParams();
  console.log(trainId)
  const [formData, setFormData] = useState({
    user: "",
    nationalId: "",
    firstName: "",
    lastName: "",
    email: "",
    seatsNum: 1,
    dependents: []
  });
  const [errors, setErrors] = useState({});
  const [reservationStatus, setReservationStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Update dependents array when seatsNum changes
    const updatedDependents = Array.from({ length: formData.seatsNum - 1 }, () => ({
      firstName: "",
      lastName: "",
    }));
    setFormData(prev => ({ ...prev, dependents: updatedDependents }));
  }, [formData.seatsNum]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "seatsNum") {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 1 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDependentChange = (index, field, value) => {
    const updatedDependents = [...formData.dependents];
    updatedDependents[index][field] = value;
    setFormData(prev => ({ ...prev, dependents: updatedDependents }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.nationalId || formData.nationalId.length !== 10) {
      newErrors.nationalId = "National ID should be 10 digits.";
    }
    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    if (formData.seatsNum < 1) newErrors.seatsNum = "At least one seat is required.";

    // Validate dependents if seats > 1
    if (formData.seatsNum > 1) {
      formData.dependents.forEach((dep, index) => {
        if (!dep.firstName || !dep.lastName) {
          newErrors[`dependent${index}`] = "Both first and last names are required for dependents.";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting.");
      return;
    }

    try {
      setReservationStatus("Processing reservation...");
      toast.info("Processing your reservation...");

      const reservationData = {
        user,
        trainId,
        nationalId: formData.nationalId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        seatsNum: formData.seatsNum,
        dependents: formData.seatsNum > 1 ? formData.dependents : undefined
      };

      const response = await axios.post('http://localhost:8000/api/reservations', reservationData);

      if (response.data.reservation) {
        setReservationStatus(`Reservation ${response.data.reservation.status}`);
        toast.success(`Reservation successfully ${response.data.reservation.status}`);
        setTimeout(() => {
          navigate('/reservations');
        }, 2000);
      }

    } catch (error) {
      console.error('Reservation error:', error);
      setReservationStatus("Error creating reservation");
      toast.error(error.response?.data?.error || "An unexpected error occurred");
      setErrors({
        submission: error.response?.data?.error || "An unexpected error occurred"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white py-10 px-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Add Reservation
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* National ID */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">
              National ID
            </label>
            <input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleInputChange}
              maxLength="10"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.nationalId && (
              <p className="text-red-500 text-sm">{errors.nationalId}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* First Name */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>

          {/* Number of Seats */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">
              <FiUsers className="inline-block mr-2" />
              Number of Seats
            </label>
            <input
              type="number"
              name="seatsNum"
              value={formData.seatsNum}
              onChange={handleInputChange}
              min="1"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {errors.seatsNum && (
              <p className="text-red-500 text-sm">{errors.seatsNum}</p>
            )}
          </div>

          {/* Dependents */}
          {formData.seatsNum > 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-800">
                Dependents Information
              </h3>
              {formData.dependents.map((dependent, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={dependent.firstName}
                      onChange={(e) => handleDependentChange(index, "firstName", e.target.value)}
                      className="w-1/2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={dependent.lastName}
                      onChange={(e) => handleDependentChange(index, "lastName", e.target.value)}
                      className="w-1/2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors[`dependent${index}`] && (
                    <p className="text-red-500 text-sm">{errors[`dependent${index}`]}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {errors.submission && (
            <div className="text-red-500 text-center">{errors.submission}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Reservation
          </button>
        </form>

        {reservationStatus && (
          <div className="mt-4 text-center text-lg font-medium text-gray-800">
            {reservationStatus}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddReservationPageAdmin;