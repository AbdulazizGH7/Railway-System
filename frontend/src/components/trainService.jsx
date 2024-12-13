
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
    }
  };
  export default trainService;