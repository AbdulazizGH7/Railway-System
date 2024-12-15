import TrainCapacityIndicator from '../components/TrainCapacityIndicator';

const CustomTrainOption = ({ data, ...props }) => {
    const loadFactor = ((data.totalSeats - data.availableSeats) / data.totalSeats) * 100;
    const loadFactorStatus = 
      loadFactor < 80 ? 'Low occupancy' :
      loadFactor < 95 ? 'Medium occupancy' :
      'High occupancy';
  
    return (
      <div
        {...props.innerProps}
        className={`p-2 ${props.isFocused ? 'bg-gray-50' : 'bg-white'} cursor-pointer`}
      >
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">{data.label}</div>
            <div className="text-sm text-gray-600">
              {data.route.from} → {data.route.to}
            </div>
            <div className="text-sm text-gray-500">
              Date: {data.date} | {data.route.departureTime.split(' ')[1]} - 
              {data.route.arrivalTime.split(' ')[1]} ({data.route.duration})
            </div>
            {data.staff.driver && (
              <div className="text-xs text-gray-400">
                Driver: {data.staff.driver.firstName} {data.staff.driver.lastName}
              </div>
            )}
            <div className="text-xs text-gray-500">
              {loadFactorStatus}
            </div>
          </div>
          <TrainCapacityIndicator 
            availableSeats={data.availableSeats} 
            totalSeats={data.totalSeats} 
          />
        </div>
      </div>
    );
  };
  export default CustomTrainOption;