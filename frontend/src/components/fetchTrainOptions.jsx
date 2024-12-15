
import trainService from '../components/trainService';
const fetchTrainOptions = async () => {
    try {
      const trains = await trainService.getAllTrains();
      return trains.map(train => ({
        value: train._id,
        label: `${train.trainNameEng} (${train.trainNameAr})`,
        availableSeats: train.availableSeats,
        totalSeats: train.totalSeats,
        route: {
          from: train.from,
          to: train.to,
          departureTime: `${train.date} ${train.departureTime}`,
          arrivalTime: `${train.date} ${train.arrivalTime}`,
          duration: train.duration
        },
        staff: train.assignedStaff,
        date: train.date
      }));
    } catch (error) {
      console.error('Error fetching trains:', error);
      throw error;
    }
  };
  export default fetchTrainOptions;