import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"; // Import useParams
import { AiOutlineCheckCircle } from "react-icons/ai";
import trainService from "../components/trainService";

function PaymentPage() {
  const { reservationId } = useParams(); // Get the reservation reservationId from the URL
  const { state } = useLocation(); // Access the passed state (if any)
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null); // Store the payment details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch the reservation details when the component mounts
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const data = await trainService.getPaymentDetails(reservationId); // Fetch data using the reservation reservationId
        setPaymentDetails(data); // Store the data in state
      } catch (err) {
        setError("Failed to fetch payment details"); // Handle error
      } finally {
        setLoading(false); // Set loading to false after fetching is complete
      }
    };

    fetchPaymentDetails();
}, [reservationId]); // Trigger the effect when the reservationId changes


const handlePaymentSuccess = async () => {
  try {
    const data = await trainService.confirmPayment(reservationId); // Call the confirm payment API
    alert("Payment Successful!");
    navigate("/reservations"); // Navigate to the reservations page after successful payment
  } catch (error) {
    console.error("Error confirming payment:", error);
    alert("Payment failed. Please try again.");
  }
};



  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  if (error) {
    return <div>{error}</div>; // Display error message if something went wrong
  }

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
            <span className="font-semibold">{paymentDetails.trainEng}</span>
          </div>
          <div className="flex justify-between items-center text-lg text-gray-600 mb-2">
            <span>Seats Reserved:</span>
            <span className="font-semibold">{paymentDetails.seatsNum}</span>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Total Payment</h3>
          <div className="flex justify-between items-center text-lg text-gray-600 mb-4">
            <span>Total Amount:</span>
            <span className="text-2xl font-bold text-green-600">﷼{paymentDetails.cost}</span>
          </div>
          <p className="text-gray-600 text-sm mb-6">
            * Includes taxes and fees for Seats. The final payment may vary based on your selection.
          </p>
        </div>

        {/* Payment Confirmation */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handlePaymentSuccess} // Calls handlePaymentSuccess when clicked
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
