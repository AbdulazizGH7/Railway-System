import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ReservationModal = ({ reservation, onClose }) => {
    if (!reservation) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 relative">
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                    <FaTimes />
                </button>
                <h2 className="text-xl font-bold mb-4">Reservation Details</h2>
                <div className="space-y-2">
                    <p><strong>Reservation #:</strong> {reservation.id}</p>
                    <p><strong>Passenger ID:</strong> {reservation.passengerId}</p>
                    <p><strong>From:</strong> {reservation.from}</p>
                    <p><strong>To:</strong> {reservation.to}</p>
                    <p><strong>Date:</strong> {reservation.date}</p>
                    <p><strong>Departure Time:</strong> {reservation.departureTime}</p>
                    <p><strong>Arrival Time:</strong> {reservation.arrivalTime}</p>
                    <p><strong>Trip Duration:</strong> {reservation.duration}</p>
                </div>
            </div>
        </div>
    );
};

export default ReservationModal