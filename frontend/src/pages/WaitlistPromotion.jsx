import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';
import trainService from '../components/trainService';
import moment from 'moment';
import SelectedTrainBadge from '../components/SelectedTrainBadge';
import CustomTrainOption from '../components/CustomTrainOption';
import fetchTrainOptions from '../components/fetchTrainOptions';



const WaitlistPromotion = () => {
  const [trainOptions, setTrainOptions] = useState([]);
  const [selectedTrains, setSelectedTrains] = useState([]);
  const [waitlistedPassengers, setWaitlistedPassengers] = useState([]);
  const [selectedPassengers, setSelectedPassengers] = useState([]);
  const [promotionResult, setPromotionResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  

  const fetchWaitlistedPassengers = async (trainIds) => {
    try {
      const waitlistedPassengers = [];
      
      for (const trainId of trainIds) {
        const response = await axios.get(`http://localhost:8000/api/reservations/waitlist/${trainId}`);
        const { waitlist } = response.data;
        
        // Process each tier
        Object.entries(waitlist).forEach(([tier, passengers]) => {
          passengers.forEach(passenger => {
            waitlistedPassengers.push({
              passengerId: passenger.passengerId,
              name: passenger.passengerName,
              loyaltyTier: tier,
              seatsNum: passenger.seatsNum,
              trainNo: trainId,
              reservationId: passenger._id,
              createdAt: passenger.createdAt,
              loyaltyPoints: passenger.loyaltyPoints
            });
          });
        });
      }
  
      return waitlistedPassengers;
    } catch (error) {
      console.error('Error fetching waitlisted passengers:', error);
      throw error;
    }
  };

  // Modified promoteWaitlistedPassenger function
const promoteWaitlistedPassenger = async (trainNo, passengerId, reservationId) => {
  try {
    // First check the train's available seats
    const selectedTrain = trainOptions.find(train => train.value === trainNo);
    if (!selectedTrain) {
      throw new Error('Train information not found');
    }


    // Call the promote endpoint
    const promotionResponse = await axios.put(
      `http://localhost:8000/api/reservations/promote/${reservationId}`
    );

    if (promotionResponse.data.reservation) {
      return {
        success: true,
        message: promotionResponse.data.message,
        reservation: promotionResponse.data.reservation,
        status: 'pending',
        trainName: selectedTrain.label
      };
    }
    
    throw new Error('Promotion failed');
  } catch (error) {
    if (error.response?.data) {
      // Handle API error responses
      const errorMessage = error.response.data.message || error.response.data.error;
      throw new Error(errorMessage);
    }
    throw error;
  }
};

// Modified handlePromotePassengers function
const handlePromotePassengers = async () => {
  if (!selectedPassengers.length) {
    setError('Please select at least one passenger to promote');
    return;
  }

  setIsLoading(true);
  setError(null);

  try {
    const results = [];
    for (const passenger of selectedPassengers) {
      // Find the corresponding train
      const selectedTrain = trainOptions.find(train => train.value === passenger.trainNo);
      
      if (!selectedTrain) {
        results.push({
          passenger: passenger.name,
          error: 'Train information not found',
          status: 'failed'
        });
        continue;
      }

      try {
        const result = await promoteWaitlistedPassenger(
          passenger.trainNo, 
          passenger.passengerId,
          passenger.reservationId
        );

        if (result.success) {
          results.push({
            passenger: passenger.name,
            message: result.message,
            status: 'pending',
            seatsNum: passenger.seatsNum,
            trainName: result.trainName
          });
        }
      } catch (err) {
        results.push({
          passenger: passenger.name,
          error: err.message,
          status: 'failed',
          trainName: selectedTrain.label
        });
      }
    }

    // Set promotion results
    setPromotionResult({ promotions: results });
    
    // Refresh the waitlist if any promotions were successful
    if (results.some(r => r.status === 'pending')) {
      const trainNos = selectedTrains.map(train => train.value);
      const updatedPassengers = await fetchWaitlistedPassengers(trainNos);
      setWaitlistedPassengers(updatedPassengers);
      setSelectedPassengers([]);
    }
  } catch (err) {
    setError('An error occurred during promotion: ' + err.message);
  } finally {
    setIsLoading(false);
  }
};

// Modified renderPromotionResult to show more detailed seat availability information
const renderPromotionResult = () => {
  if (!promotionResult?.promotions?.length) return null;

  return (
    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
      <div className="flex items-center mb-2">
        <h3 className="font-medium text-gray-700">Promotion Results:</h3>
      </div>
      {promotionResult.promotions.map((result, index) => (
        <div 
          key={index} 
          className={`mt-2 p-3 rounded-md ${
            result.status === 'pending' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">{result.passenger}</p>
              <p className="text-sm text-gray-600">Train: {result.trainName}</p>
              {result.status === 'pending' ? (
                <>
                  <p className="text-sm text-green-600">
                    Successfully promoted to pending status
                  </p>
                  <p className="text-sm text-gray-600">
                    Seats promoted: {result.seatsNum}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-red-600">
                    {result.error}
                  </p>
                  {result.seatsNeeded && (
                    <p className="text-sm text-gray-600">
                      Seats needed: {result.seatsNeeded} | Available: {result.seatsAvailable}
                    </p>
                  )}
                </>
              )}
            </div>
            {result.status === 'pending' ? (
              <CheckCircle className="text-green-500" />
            ) : (
              <AlertCircle className="text-red-500" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};



  const handleFetchPassengers = async () => {
    if (!selectedTrains.length) {
      setError('Please select at least one train');
      return;
    }

    setIsLoading(true);
    setError(null);
    setWaitlistedPassengers([]);
    setSelectedPassengers([]);

    try {
      const trainNos = selectedTrains.map((train) => train.value);
      const passengers = await fetchWaitlistedPassengers(trainNos);

      if (passengers.length === 0) {
        setError('No waitlisted passengers found for the selected trains');
        return;
      }

      setWaitlistedPassengers(passengers);
    } catch (err) {
      setError('Failed to fetch waitlisted passengers: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPassenger = (passenger) => {
    setSelectedPassengers([passenger]);
  };

  const renderPassengersList = () => {
    const tiers = ['Gold', 'Silver', 'Green', 'Regular'];
    
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Waitlisted Passengers by Tier</h3>
        {tiers.map(tier => {
          const tierPassengers = waitlistedPassengers.filter(p => p.loyaltyTier === tier);
          return tierPassengers.length > 0 && (
            <div key={tier} className="mb-4">
              <h4 className={`text-md font-medium mb-2 ${
                tier === 'Gold' ? 'text-yellow-600' : 
                tier === 'Silver' ? 'text-gray-500' :
                tier === 'Green' ? 'text-green-600' : 'text-blue-600'
              }`}>
                {tier} Tier
              </h4>
              <div className="space-y-2">
                {tierPassengers.map((passenger) => (
                  <div
                    key={passenger.passengerId}
                    onClick={() => handleSelectPassenger(passenger)}
                    className={`p-3 border rounded-md cursor-pointer transition-all ${
                      selectedPassengers.some((p) => p.passengerId === passenger.passengerId)
                        ? 'bg-blue-100 border-blue-500'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{passenger.name}</p>
                        <p className="text-sm text-gray-600">
                          Seats Requested: {passenger.seatsNum}
                        </p>
                        <p className="text-sm text-gray-500">
                          Waitlisted since: {moment(passenger.createdAt).format('DD MMM YYYY, HH:mm')}
                        </p>
                      </div>
                      {selectedPassengers.some((p) => p.passengerId === passenger.passengerId) && 
                        <ArrowRight className="text-blue-600" />
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

 

  useEffect(() => {
    const loadTrainOptions = async () => {
      try {
        const trains = await fetchTrainOptions();
        setTrainOptions(trains);
      } catch (err) {
        setError('Failed to load train options: ' + err.message);
      }
    };

    loadTrainOptions();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Waitlist Passenger Promotion
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Train(s)</label>
        <Select
          options={trainOptions}
          isMulti
          onChange={setSelectedTrains}
          className="basic-multi-select"
          classNamePrefix="select"
          components={{
            Option: CustomTrainOption
          }}
        />
      </div>

      {selectedTrains.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Trains</h3>
          {selectedTrains.map(train => (
            <SelectedTrainBadge key={train.value} train={train} />
          ))}
        </div>
      )}

      <button
        onClick={handleFetchPassengers}
        disabled={!selectedTrains.length || isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
      >
        {isLoading ? 'Loading...' : 'Fetch Waitlisted Passengers'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-center">
          <AlertCircle className="mr-2 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {waitlistedPassengers.length > 0 && renderPassengersList()}

      {selectedPassengers.length > 0 && (
        <button
          onClick={handlePromotePassengers}
          disabled={isLoading}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-green-300"
        >
          {isLoading ? 'Promoting...' : 'Promote Selected Passengers'}
        </button>
      )}

      {renderPromotionResult()}
    </div>
  );
};

export default WaitlistPromotion;