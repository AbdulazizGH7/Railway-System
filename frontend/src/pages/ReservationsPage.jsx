import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPen } from 'react-icons/fa';
import { AiOutlineCheckCircle } from 'react-icons/ai';

function ReservationsPage({ userType }) {
  const isAdmin = userType === 'Admin';
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([
    { 
      id: '23789273', 
      passengerId: '202162490', 
      from: 'Hufof', 
      to: 'Riyadh', 
      date: '2024-1-1',
      departureTime: '08:00 AM',
      arrivalTime: '09:30 AM',
      duration: '1h 30m',
      isPaid: false, 
    },
    { 
      id: '23789274', 
      passengerId: '202162491', 
      from: 'Dammam', 
      to: 'Jeddah', 
      date: '2024-1-2',
      departureTime: '10:00 AM',
      arrivalTime: '12:00 PM',
      duration: '2h 00m',
      isPaid: false, 
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [deleteReservation, setDeleteReservation] = useState(null);
  const [editReservation, setEditReservation] = useState(null);

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.id.includes(searchQuery) || reservation.passengerId.includes(searchQuery)
  );

  const handleRowClick = (reservation) => {
    setSelectedReservation(reservation);
  };

  const handleDelete = (id) => {
    setReservations(reservations.filter(reservation => reservation.id !== id));
  };

  const handleEdit = (updatedReservation) => {
    setReservations(reservations.map(reservation => 
      reservation.id === updatedReservation.id ? updatedReservation : reservation
    ));
  };

  const handlePaymentRedirect = (reservation) => {
    navigate('/payment', {
      state: { 
        trip: reservation,
        numSeats: 1,
      }
    });
  };

  const handleAddReservation = () => {
    // Navigate to the 'Add Reservation' page
    navigate('/add-reservation-admin');
  };

  return (
    <div className="flex flex-col items-center justify-start space-y-6 my-5">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Reservation# or PassengerID"
        className="border rounded px-4 py-2 w-10/12 bg-gray-50 shadow-md focus:ring-2 focus:ring-blue-400 transition-all"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Add Reservation Button (Admin Only) */}
      {isAdmin && (
        <button
          onClick={handleAddReservation}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mt-4"
        >
          Add Reservation
        </button>
      )}

      {/* Cards Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-10/12">
        {filteredReservations.length > 0 ? (
          filteredReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 duration-200 p-6 cursor-pointer border border-gray-200"
              onClick={() => handleRowClick(reservation)}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{reservation.from} to {reservation.to}</h3>
              <p className="text-sm text-gray-600">Date: {reservation.date}</p>
              <p className="text-sm text-gray-600">Departure: {reservation.departureTime}</p>
              <p className="text-sm text-gray-600">Arrival: {reservation.arrivalTime}</p>
              <p className="text-sm text-gray-600">Duration: {reservation.duration}</p>

              <div className="mt-4">
                {reservation.isPaid ? (
                  <span className="text-green-600 font-semibold">Paid</span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePaymentRedirect(reservation);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  >
                    Paying <AiOutlineCheckCircle className="inline-block ml-2 text-xl" />
                  </button>
                )}
              </div>

              {isAdmin && (
                <div className="mt-4 flex space-x-4 text-lg">
                  <FaPen 
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditReservation(reservation);
                    }} 
                  />
                  <FaTrash 
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteReservation(reservation);
                    }} 
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="w-full text-center text-gray-600">No reservations found.</div>
        )}
      </div>

      {/* Reservation Details Modal */}
      {selectedReservation && (
        <ReservationModal 
          reservation={selectedReservation} 
          onClose={() => setSelectedReservation(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteReservation && (
        <DeleteConfirmationModal 
          reservation={deleteReservation}
          onClose={() => setDeleteReservation(null)}
          onConfirm={handleDelete}
        />
      )}

      {/* Edit Reservation Modal */}
      {editReservation && (
        <EditReservationModal 
          reservation={editReservation}
          onClose={() => setEditReservation(null)}
          onSave={handleEdit}
        />
      )}
    </div>
  );
}

export default ReservationsPage;
