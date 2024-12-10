import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AiOutlineCheckCircle } from "react-icons/ai";

function PaymentPage() {
  const { state } = useLocation(); // Access the passed state
  const [paymentAmount, setPaymentAmount] = useState(0);

  // Calculate payment based on the number of seats and luggage
  useEffect(() => {
    const seatPrice = 50; // Example price per seat
    const luggagePrice = 10; // Example price per luggage

    // Payment calculation: seats * price + luggage * price
    const totalAmount =
      state.numSeats * seatPrice + state.numLuggage * luggagePrice;
    setPaymentAmount(totalAmount);
  }, [state]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-10 px-4">
      <div className="max-w-xl mx-auto bg-white p-10 rounded-2xl shadow-xl transform hover:scale-105 duration-300 transition-all">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Payment Details
        </h2>

        {/* Booking Details */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Booking Summary
          </h3>
          <div className="flex justify-between items-center text-lg text-gray-600 mb-2">
            <span>Train:</span>
            <span className="font-semibold">{state.trip.trainEng}</span>
          </div>
          <div className="flex justify-between items-center text-lg text-gray-600 mb-2">
            <span>Seats Reserved:</span>
            <span className="font-semibold">{state.numSeats}</span>
          </div>
          <div className="flex justify-between items-center text-lg text-gray-600 mb-2">
            <span>Luggage:</span>
            <span className="font-semibold">{state.numLuggage}</span>
          </div>
          <div className="flex justify-between items-center text-lg text-gray-600 mb-4">
            <span>Luggage Weight:</span>
            <span className="font-semibold">{state.luggageWeight} kg</span>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Total Payment</h3>
          <div className="flex justify-between items-center text-lg text-gray-600 mb-4">
            <span>Total Amount:</span>
            <span className="text-2xl font-bold text-green-600">﷼{paymentAmount}</span>
          </div>
          <p className="text-gray-600 text-sm mb-6">
            * Includes taxes and fees for luggage. The final payment may vary based on your selection.
          </p>
        </div>

        {/* Payment Confirmation */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => alert("Payment Successful!")}
            className="w-full bg-blue-600 text-white text-lg py-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200"
          >
            Confirm Payment <AiOutlineCheckCircle className="inline-block ml-2 text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
