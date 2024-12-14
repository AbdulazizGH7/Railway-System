import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPen } from 'react-icons/fa';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import trainService from '../components/trainService';
import ReservationModal from '../components/ReservationModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import EditReservationModal from '../components/EditReservationModal';

function ReservationsPage({ userType }) {
  const isAdmin = userType === 'admin';
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [deleteReservation, setDeleteReservation] = useState(null);
  const [editReservation, setEditReservation] = useState(null);

  // Fetch reservations on mount
  useEffect(() => {
    async function fetchReservations() {
      try {
        const data = await trainService.getAllReservations();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    }

    fetchReservations();
  }, []);

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.reservationId.includes(searchQuery) ||
      reservation.passengerId.includes(searchQuery)
  );

  const handleRowClick = (reservation) => {
    setSelectedReservation(reservation);
  };

  const handleDelete = async (id) => {
    try {
      await trainService.deleteReservation(id);
      setReservations((prev) => prev.filter((res) => res.reservationId !== id));
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  const handleEdit = async (updatedReservation) => {
    try {
      const updatedData = await trainService.updateReservation(
        updatedReservation.reservationId,
        updatedReservation
      );
      setReservations((prev) =>
        prev.map((res) =>
          res.reservationId === updatedReservation.reservationId ? updatedData : res
        )
      );
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  };

  const handlePaymentRedirect = (reservation) => {
    navigate('/payment', {
      state: { 
        trip: reservation,
        numSeats: reservation.seatsNum,
      }
    });
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

      {/* Cards Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-10/12">
        {filteredReservations.length > 0 ? (
          filteredReservations.map((reservation) => (
            <div
              key={reservation.reservationId}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 duration-200 p-6 cursor-pointer border border-gray-200"
              onClick={() => handleRowClick(reservation)}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{reservation.from} to {reservation.to}</h3>
              <p className="text-sm text-gray-600">Passenger ID: {reservation.passengerId}</p>
              <p className="text-sm text-gray-600">Date: {reservation.date}</p>
              <p className="text-sm text-gray-600">Payment Deadline: {reservation.paymentDeadline}</p>
              <p className="text-sm text-gray-600">Departure: {reservation.departureTime}</p>
              <p className="text-sm text-gray-600">Arrival: {reservation.arrivalTime}</p>

              <div className="mt-4">
                {isAdmin ? (
                  reservation.status === 'confirmed' ? (
                    <span className="text-green-600 font-semibold">Paid</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">Pending</span>
                  )
                ) : (
                  reservation.status === 'confirmed' ? (
                    <span className="text-green-600 font-semibold">Confirmed</span>
                  ) : reservation.status === 'waitlisted' ? (
                    <span className="text-gray-600 font-semibold">Waitlist</span>
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
                  )
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
          onConfirm={() => handleDelete(deleteReservation.reservationId)}
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
