import React, { useState } from 'react';
import ReservationModal from '../components/ReservationModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import EditReservationModal from '../components/EditReservationModal';
import { FaTrash, FaPen } from 'react-icons/fa';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

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
        // Redirect to the PaymentPage with the reservation details
        navigate('/payment', {
            state: { 
                trip: reservation,
                numSeats: 1, // Example, change according to actual logic
                numLuggage: 0, // Example, change according to actual logic
                luggageWeight: 0, // Example, change according to actual logic
            }
        });
    };

    return (
        <div className="flex flex-col items-center justify-start space-y-6 my-5">
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by Reservation# or PassengerID"
                className="border rounded px-4 py-2 w-10/12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <table className="border-black border-solid border-2 table-auto w-10/12 text-left">
                <thead>
                    <tr className="bg-gray-300">
                        <th className="px-4 py-2">Reservation#</th>
                        <th className="px-4 py-2">PassengerID</th>
                        <th className="px-4 py-2">From</th>
                        <th className="px-4 py-2">To</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Payment Status</th>
                        {isAdmin && <th className="px-4 py-2"></th>}
                        {isAdmin && <th className="px-4 py-2"></th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredReservations.length > 0 ? (
                        filteredReservations.map((reservation) => (
                            <tr
                                key={reservation.id}
                                className="border-b odd:bg-slate-200 even:bg-slate-100 hover:bg-gray-300 cursor-pointer"
                                onClick={() => handleRowClick(reservation)}
                            >
                                <td className="px-4 py-2">{reservation.id}</td>
                                <td className="px-4 py-2">{reservation.passengerId}</td>
                                <td className="px-4 py-2">{reservation.from}</td>
                                <td className="px-4 py-2">{reservation.to}</td>
                                <td className="px-4 py-2">{reservation.date}</td>
                                <td className="px-4 py-2">
                                    {reservation.isPaid ? (
                                        <span className="text-green-600 font-semibold">Paid</span>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePaymentRedirect(reservation); // Navigate to PaymentPage
                                            }}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                        >
                                            Paying <AiOutlineCheckCircle className="inline-block ml-2 text-xl" />
                                        </button>
                                    )}
                                </td>
                                {isAdmin && (
                                    <td className="px-4 py-2">
                                        <FaPen 
                                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditReservation(reservation);
                                            }} 
                                        />
                                    </td>
                                )}
                                {isAdmin && (
                                    <td className="px-4 py-2">
                                        <FaTrash 
                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteReservation(reservation);
                                            }} 
                                        />
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={isAdmin ? 8 : 6}
                                className="px-4 py-2 text-center"
                            >
                                No reservations found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

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
