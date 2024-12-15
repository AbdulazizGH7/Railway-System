

const TrainCapacityIndicator = ({ availableSeats, totalSeats }) => {
    const loadFactor = ((totalSeats - availableSeats) / totalSeats) * 100;
    const loadFactorFormatted = loadFactor.toFixed(1);
    
    return (
      <div className="flex items-center space-x-2">
        <div className="text-sm">
          <span className={`font-medium ${
            loadFactor < 80 ? 'text-green-600' : 
            loadFactor < 95 ? 'text-yellow-600' : 
            'text-red-600'
          }`}>
            {loadFactorFormatted}%
          </span>
        </div>
        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              loadFactor < 80 ? 'bg-green-500' :
              loadFactor < 95 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}
            style={{ width: `${loadFactor}%` }}
          />
        </div>
      </div>
    );
  };

  export default TrainCapacityIndicator;