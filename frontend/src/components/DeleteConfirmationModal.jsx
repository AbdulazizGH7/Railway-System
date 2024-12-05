import React, { useState } from 'react';
import { FaTrash, FaPen, FaTimes } from 'react-icons/fa';

const DeleteConfirmationModal = ({ reservation, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 relative">
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                    <FaTimes />
                </button>
                <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                <p className="mb-6">Are you sure you want to delete reservation #{reservation.id}?</p>
                <div className="flex justify-end space-x-4">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => {
                            onConfirm(reservation.id);
                            onClose();
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal