
import axios from 'axios';


 const trainService = {
    async getAllTrains() {
      try {
        const response = await axios.get("http://localhost:8000/api/trains");
        // Ensure we return an array
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Error fetching trains:', error);
        return [];
      }
    },
  
    async getTodayTrains() {
      try {
        const response = await axios.get("http://localhost:8000/api/trains/today");
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Error fetching today\'s trains:', error);
        return [];
      }
    },
  
    async reserveTrip(tripData) {
      const response = await axios.post("http://localhost:8000/api/reservations", tripData);
      return response.data;
    },

    async getAllReservations() {
      try {
        const response = await axios.get("http://localhost:8000/api/reservations");
        return response.data;
      } catch (error) {
        console.error("Error fetching reservations:", error);
        throw error;
      }
    },
  
    async getReservationByPassenger(passengerId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/reservations/${passengerId}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching reservations for passenger ${passengerId}:`, error);
        throw error;
      }
    },
  
    async deleteReservation(reservationId) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/reservations/${reservationId}`);
        return response.data;
      } catch (error) {
        console.error(`Error deleting reservation ${reservationId}:`, error);
        throw error;
      }
    },
  
    async updateReservation(reservationId, updatedData) {
      try {
        const response = await axios.put(`http://localhost:8000/api/reservations/${reservationId}`, updatedData);
        return response.data;
      } catch (error) {
        console.error(`Error updating reservation ${reservationId}:`, error);
        throw error;
      }
    },
  
    async confirmPayment(reservationId) {
      try {
        const response = await axios.put(`http://localhost:8000/api/reservations/pay/${reservationId}`);
        return response.data;
      } catch (error) {
        console.error(`Error confirming payment for reservation ${reservationId}:`, error);
        throw error;
      }
    },

    async getPaymentDetails(reservationId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/reservations/pay/${reservationId}`);
        return response.data; // Return the reservation details
      } catch (error) {
        console.error(`Error fetching payment details for reservation ${reservationId}:`, error);
        throw error; // Rethrow the error to handle it in the component
      }
    },
  };
  export default trainService;