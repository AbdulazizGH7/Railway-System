
import TrainCapacityIndicator from '../components/TrainCapacityIndicator';
import moment from 'moment';

const SelectedTrainBadge = ({ train }) => {
  const loadFactor = ((train.totalSeats - train.availableSeats) / train.totalSeats) * 100;
  const loadFactorStatus = 
    loadFactor < 80 ? 'Low occupancy' :
    loadFactor < 95 ? 'Medium occupancy' :
    'High occupancy';

  return (
    <div className="flex items-center justify-between bg-blue-50 p-2 rounded-md mb-2">
      <div>
        <div className="font-medium">{train.label}</div>
        <div className="text-sm text-gray-600">
          {train.route.from} → {train.route.to}
        </div>
        <div className="text-sm text-gray-500">
          {moment(train.route.departureTime).format('HH:mm')} - 
          {moment(train.route.arrivalTime).format('HH:mm')}
        </div>
        <div className="text-xs text-gray-500">
          {loadFactorStatus}
        </div>
      </div>
      <TrainCapacityIndicator 
        availableSeats={train.availableSeats} 
        totalSeats={train.totalSeats} 
      />
    </div>
  );
};
export default SelectedTrainBadge