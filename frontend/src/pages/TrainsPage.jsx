import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrain, FaCircle, FaArrowRight } from 'react-icons/fa';
import moment from 'moment';

function TrainsPage() {
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTrains();
    }, []);

    const fetchTrains = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/trains/stations');
            if (response.data.success) {
                setTrains(response.data.trains);
            }
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch train routes');
            setLoading(false);
        }
    };

    const StationTimeline = ({ stations }) => (
        <div className="relative pl-8">
            {stations.map((station, index) => (
                <div key={station.stationId} className="mb-6 relative">
                    {/* Vertical line connecting stations */}
                    {index < stations.length - 1 && (
                        <div className="absolute left-[-16px] top-6 w-0.5 h-full bg-gray-300"></div>
                    )}
                    
                    {/* Station marker */}
                    <div className={`absolute left-[-20px] top-2 w-8 h-8 rounded-full flex items-center justify-center
                        ${station.type === 'departure' ? 'bg-green-500' : 
                          station.type === 'arrival' ? 'bg-red-500' : 
                          'bg-blue-500'} text-white`}>
                        <FaCircle className="text-sm" />
                    </div>

                    {/* Station information */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="font-semibold text-lg">{station.city}</div>
                        <div className="text-sm text-gray-600">
                            {moment(station.estimatedTime).format('hh:mm A')}
                        </div>
                        <div className="text-xs text-gray-500 uppercase">
                            {station.type === 'departure' ? 'Departure Station' : 
                             station.type === 'arrival' ? 'Arrival Station' : 
                             'Intermediate Station'}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <div className="text-xl font-bold mb-2">Error</div>
                    <div>{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Train Routes</h1>
                
                <div className="grid gap-8">
                    {trains.map(train => (
                        <div key={train._id} className="bg-white rounded-xl shadow-lg p-6">
                            {/* Train Header */}
                            <div className="flex items-center mb-6">
                                <FaTrain className="text-3xl text-blue-500 mr-4" />
                                <div>
                                    <h2 className="text-xl font-bold">{train.nameEng}</h2>
                                    <p className="text-gray-600">{train.nameAr}</p>
                                    <p className="text-sm text-gray-500">
                                        {train.totalStations} stations
                                    </p>
                                </div>
                            </div>

                            {/* Route Timeline */}
                            <div className="ml-4">
                                <StationTimeline stations={train.stations} />
                            </div>

                            {/* Journey Summary */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <div>
                                        Total Journey Time: 
                                        {moment.duration(
                                            moment(train.stations[train.stations.length - 1].estimatedTime)
                                            .diff(moment(train.stations[0].estimatedTime))
                                        ).asHours().toFixed(1)} hours
                                    </div>
                                    <div>
                                        {train.stations[0].city} <FaArrowRight className="inline mx-2" /> 
                                        {train.stations[train.stations.length - 1].city}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TrainsPage;