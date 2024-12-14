import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

const WaitlistPromotion = () => {
  const [trainOptions, setTrainOptions] = useState([]);
  const [selectedTrains, setSelectedTrains] = useState([]);
  const [waitlistedPassengers, setWaitlistedPassengers] = useState([]);
  const [selectedPassengers, setSelectedPassengers] = useState([]);
  const [promotionResult, setPromotionResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Loyalty tier classification
  const getLoyaltyTier = (points) => {
    if (points >= 600) return 'Gold';
    if (points >= 400) return 'Silver';
    if (points >= 200) return 'Green';
    return 'Regular';
  };

  // Simulated train API
  const fetchTrainOptions = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { value: 'TR101', label: 'Express Aziz (Al-hasa → Al-baha, 2024-06-15)' },
          { value: 'TR202', label: 'King Fahad (Dammam → Al Jubail, 2024-06-16)' },
        ]);
      }, 500);
    });
  };

  // Simulated waitlist fetch API
  const fetchWaitlistedPassengers = async (trainNos) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const waitlistData = {
          'TR101': [
            { passengerId: 'P001', name: 'Ali', loyaltyPoints: 450, class: 'Second AC', waitlistPosition: 1 },
            { passengerId: 'P002', name: 'Khalid', loyaltyPoints: 650, class: 'First AC', waitlistPosition: 2 },
            { passengerId: 'P004', name: 'Mohammed', loyaltyPoints: 250, class: 'Second AC', waitlistPosition: 3 },
            { passengerId: 'P005', name: 'Sara', loyaltyPoints: 150, class: 'Sleeper', waitlistPosition: 4 },
          ],
          'TR202': [
            { passengerId: 'P003', name: 'Ahmad', loyaltyPoints: 750, class: 'First AC', waitlistPosition: 1 },
            { passengerId: 'P006', name: 'Fatima', loyaltyPoints: 550, class: 'Second AC', waitlistPosition: 2 },
            { passengerId: 'P007', name: 'Hassan', loyaltyPoints: 350, class: 'Sleeper', waitlistPosition: 3 },
          ],
        };

        const combinedPassengers = trainNos.flatMap((trainNo) => waitlistData[trainNo] || []);
        resolve(combinedPassengers);
      }, 500);
    });
  };

  // Simulated passenger promotion API
  const promoteWaitlistedPassenger = async (trainNo, passengerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          seatNumber: `${trainNo.slice(-2)}${passengerId.slice(-2)}`,
          class: 'Second AC',
          pnrNumber: `PNR${Math.floor(Math.random() * 1000000)}`,
        });
      }, 500);
    });
  };

  useEffect(() => {
    const loadTrainOptions = async () => {
      const trains = await fetchTrainOptions();
      setTrainOptions(trains);
    };

    loadTrainOptions();
  }, []);

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
      setError('Failed to fetch waitlisted passengers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPassenger = (passenger) => {
    setSelectedPassengers((prevSelected) =>
      prevSelected.some((p) => p.passengerId === passenger.passengerId)
        ? prevSelected.filter((p) => p.passengerId !== passenger.passengerId)
        : [...prevSelected, passenger]
    );
  };

  const handlePromotePassengers = async () => {
    if (!selectedPassengers.length) {
      setError('Please select at least one passenger to promote');
      return;
    }

    try {
      const trainNo = selectedTrains[0]?.value || 'Unknown Train';
      for (const passenger of selectedPassengers) {
        const result = await promoteWaitlistedPassenger(trainNo, passenger.passengerId);

        if (result.success) {
          setPromotionResult((prev) => ({
            ...prev,
            promotions: [
              ...(prev?.promotions || []),
              { passenger: passenger.name, seatNumber: result.seatNumber, pnrNumber: result.pnrNumber },
            ],
          }));

          setWaitlistedPassengers((prev) =>
            prev.filter((p) => p.passengerId !== passenger.passengerId)
          );
        } else {
          setError('Promotion failed');
        }
      }

      setSelectedPassengers([]);
    } catch (err) {
      setError('An error occurred during promotion');
    }
  };

  // Group passengers by loyalty tier
  const groupedPassengers = waitlistedPassengers.reduce((acc, passenger) => {
    const tier = getLoyaltyTier(passenger.loyaltyPoints);
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(passenger);
    return acc;
  }, {});

  const renderPassengersByTier = () => {
    const tiers = ['Gold', 'Silver', 'Green', 'Regular'];
    
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Waitlisted Passengers by Tier</h3>
        {tiers.map(tier => (
          groupedPassengers[tier]?.length > 0 && (
            <div key={tier} className="mb-4">
              <h4 className={`text-md font-medium mb-2 ${
                tier === 'Gold' ? 'text-yellow-600' :
                tier === 'Silver' ? 'text-gray-500' :
                tier === 'Green' ? 'text-green-600' :
                'text-blue-600'
              }`}>
                {tier} Tier
              </h4>
              <div className="space-y-2">
                {groupedPassengers[tier].map((passenger) => (
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
                          ID: {passenger.passengerId} | 
                          Waitlist Position: {passenger.waitlistPosition} | 
                          Class: {passenger.class} | 
                          Loyalty Points: {passenger.loyaltyPoints}
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
          )
        ))}
      </div>
    );
  };

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
        />
      </div>

      <button
        onClick={handleFetchPassengers}
        disabled={!selectedTrains.length || isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isLoading ? 'Loading...' : 'Fetch Waitlisted Passengers'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-center">
          <AlertCircle className="mr-2 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {waitlistedPassengers.length > 0 && renderPassengersByTier()}

      <button
        onClick={handlePromotePassengers}
        disabled={!selectedPassengers.length}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Promote Selected Passengers
      </button>

      {promotionResult?.promotions && promotionResult.promotions.length > 0 && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-md flex items-center">
          <CheckCircle className="mr-2 text-green-600" />
          <div>
            <p>Promotion Results:</p>
            {promotionResult.promotions.map((result, index) => (
              <div key={index}>
                <p>{result.passenger} promoted to seat {result.seatNumber}</p>
                <p>PNR: {result.pnrNumber}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitlistPromotion;