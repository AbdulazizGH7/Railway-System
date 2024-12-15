import React, { useEffect, useState, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPen,FaSearch } from 'react-icons/fa';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import trainService from '../components/trainService';
import ReservationModal from '../components/ReservationModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import EditReservationModal from '../components/EditReservationModal';
import { useUser } from '../contexts/UserContext';

function ReservationsPage() {
  const { user } = useUser();
  const isAdmin = user?.role === 'admin';  // Assuming user object has a role field
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [deleteReservation, setDeleteReservation] = useState(null);
  const [editReservation, setEditReservation] = useState(null);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    async function fetchReservations() {
      try {
        if (!isAdmin) {
          // Assuming the user object contains _id
          if (user && user._id) {
            const data = await trainService.getReservationByPassenger(user._id);
            setReservations(data);
          } else {
            console.log("No passenger ID found for the user.");
            setReservations([]); // No reservations if no _id
          }
        } else {
          const data = await trainService.getAllReservations();
          setReservations(data);
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    }
  
    fetchReservations();
  }, [user, isAdmin]);
  

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.reservationId.toString().includes(searchQuery) ||
      reservation.passengerId.toString().includes(searchQuery)
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
      const updatedData = await trainService.updateReservation(updatedReservation.reservation._id,{
        trainId: updatedReservation.reservation.train,
        seatsNum: updatedReservation.reservation.seatsNum,
        dependents: updatedReservation.reservation.dependents
        }
      );
      window.location.reload()
      
      // setReservations((prev) =>{
      //   console.log(prev)
      //   prev.map((res) =>
      //     res.reservationId === updatedReservation.reservation._id ? updatedData : res
      // );
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  };

  const handlePaymentRedirect = (reservation) => {
    navigate(`/payment/${reservation.reservationId}`, {
      state: { 
        trip: reservation,
        numSeats: reservation.seatsNum,
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-start space-y-6 my-5">
      {/* Search Bar */}
      <div className="w-10/12 relative">
        <input
          type="text"
          placeholder="Search by Reservation# or _id"
          className="w-full border rounded-lg px-4 py-3 bg-gray-50 shadow-md 
            focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all
            pl-10" // Added left padding for the search icon
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-10/12">
        {filteredReservations.length > 0 ? (
          filteredReservations.map((reservation) => (
            <div
              key={reservation.reservationId}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 p-6 border border-gray-200"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {reservation.from} to {reservation.to}
                </h3>
              </div>
  
              {/* Content */}
              <div className="space-y-2 mb-4 cursor-pointer" onClick={() => handleRowClick(reservation)}>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-32 font-medium">Passenger ID:</span>
                  <span>{reservation.passengerId}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-32 font-medium">Date:</span>
                  <span>{reservation.date}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-32 font-medium">Deadline:</span>
                  <span>{reservation.paymentDeadline}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-32 font-medium">Departure:</span>
                  <span>{reservation.departureTime}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-32 font-medium">Arrival:</span>
                  <span>{reservation.arrivalTime}</span>
                </div>
              </div>
  
              {/* Status and Actions */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between items-center">
                  {isAdmin ? (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      reservation.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : (reservation.status === 'waitlisted' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800')
                    }`}>
                      {reservation.status === 'confirmed' ? 'Paid' : (reservation.status === 'waitlisted' ? 'Waitlisted' : 'Pending')}
                    </span>
                  ) : (
                    <div className="w-full">
                      {reservation.status === 'confirmed' ? (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Confirmed
                        </span>
                      ) : reservation.status === 'waitlisted' ? (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                          Waitlist
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePaymentRedirect(reservation);
                          }}
                          className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg 
                            bg-blue-500 hover:bg-blue-600 text-white font-medium 
                            transition-all duration-200 hover:scale-105"
                        >
                          <span>Pay Now</span>
                          <AiOutlineCheckCircle className="ml-2 text-xl" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
  
                {/* Admin Actions */}
{isAdmin && (
  <div className="flex gap-2">
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (reservation.status !== 'confirmed') {
          setEditReservation(reservation);
        }
      }}
      disabled={reservation.status === 'confirmed'}
      className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg
        ${
          reservation.status === 'confirmed' 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 hover:bg-gray-100' 
            : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200'
        }
        transition-all duration-200`}
      title={reservation.status === 'confirmed' ? 'Cannot edit paid reservations' : 'Edit reservation'}
    >
      <FaPen className={`mr-2 w-4 h-4 ${reservation.status === 'confirmed' ? 'opacity-50' : ''}`} />
      Edit
      {reservation.status === 'confirmed' && (
        <span className="ml-2 text-xs text-gray-500">(Paid)</span>
      )}
    </button>
    <button
      onClick={(e) => {
        e.stopPropagation();
        setDeleteReservation(reservation);
      }}
      className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg
        bg-red-50 hover:bg-red-100 text-red-600 font-medium
        transition-all duration-200 border border-red-200"
    >
      <FaTrash className="mr-2 w-4 h-4" />
      Delete
    </button>
  </div>
)}
                
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center p-8 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-gray-400 text-lg mb-2">No reservations found</div>
              <div className="text-gray-500 text-sm">Try adjusting your search criteria</div>
            </div>
          </div>
        )}
      </div>
  
      {/* Modals */}
      {selectedReservation && (
        <ReservationModal 
          reservation={selectedReservation} 
          onClose={() => setSelectedReservation(null)}
        />
      )}
  
      {deleteReservation && (
        <DeleteConfirmationModal 
          reservation={deleteReservation}
          onClose={() => setDeleteReservation(null)}
          onConfirm={() => handleDelete(deleteReservation.reservationId)}
        />
      )}
  
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
