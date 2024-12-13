const express = require('express');
const router = express.Router();
const moment = require('moment');
const Train = require('../models/Train');
const Reservation = require('../models/Reservation');
const User = require('../models/User')
const Station = require('../models/Station');

// @desc return all the trains traveling today
router.get('/today', async (req, res) => {
    try {
        // Get today's start and end dates
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Find trains departing today with explicit population of fields
        const trains = await Train.find({
            'route.source.departureTime': {
                $gte: startOfDay,
                $lte: endOfDay
            },
            'status': 'active'
        }).populate({
            path: 'route.source.station',
            model: 'Station',
            select: 'city'
        }).populate({
            path: 'route.destination.station',
            model: 'Station',
            select: 'city'
        });

        // Format the response
        const formattedTrains = trains.map(train => {
            const sourceCity = train.route.source.station.city.substring(0, 3).toUpperCase();
            const destCity = train.route.destination.station.city.substring(0, 3).toUpperCase();

            const departureTime = moment(train.route.source.departureTime).format('HH:mm');
            const arrivalTime = moment(train.route.destination.arrivalTime).format('HH:mm');

            // Calculate duration
            const duration = moment.duration(
                moment(train.route.destination.arrivalTime).diff(
                    moment(train.route.source.departureTime)
                )
            );
            const hours = Math.floor(duration.asHours());
            const minutes = duration.minutes();
            const formattedDuration = `${hours}h ${minutes}m`;

            return {
                _id: train._id,
                from: sourceCity,
                to: destCity,
                departure: departureTime,
                arrival: arrivalTime,
                duration: formattedDuration
            };
        });

        res.json(formattedTrains);
    } catch (error) {
        console.error('Detailed error:', error); // For debugging
        res.status(500).json({ message: 'Error fetching trains', error: error.message });
    }
});

// @desc return all the trains 
// @desc return all the trains 
router.get('/', async (req, res) => {
    try {
        const isAdmin = req.query.role === 'admin'
        // Get all active trains with populated station information
        const trains = await Train.find({ status: 'active' })
            .populate({
                path: 'route.source.station',
                model: 'Station',
                select: 'city'
            })
            .populate({
                path: 'route.destination.station',
                model: 'Station',
                select: 'city'
            });

        // Get waitlisted reservations for all trains
        const waitlistedReservations = await Reservation.find({
            train: { $in: trains.map(train => train._id) },
            status: 'waitlisted'
        }).distinct('train');

        const waitlistedTrainIds = new Set(waitlistedReservations.map(id => id.toString()));

        // Format the response
        const formattedTrains = trains.map(train => {
            // Calculate duration
            const duration = moment.duration(
                moment(train.route.destination.arrivalTime).diff(
                    moment(train.route.source.departureTime)
                )
            );
            const hours = Math.floor(duration.asHours());
            const minutes = duration.minutes();
            const formattedDuration = `${hours}h ${minutes}m`;

            return {
                _id: train._id,
                from: train.route.source.station.city,
                to: train.route.destination.station.city,
                trainNameEng: train.nameEng,
                trainNameAr: train.nameAr,
                date: moment(train.route.source.departureTime).format('YYYY-MM-DD'),
                departureTime: moment(train.route.source.departureTime).format('HH:mm'),
                arrivalTime: moment(train.route.destination.arrivalTime).format('HH:mm'),
                duration: formattedDuration, // Added duration field
                // Show 0 seats if train has waitlisted reservations
                availableSeats: isAdmin ? train.availableSeats : (waitlistedTrainIds.has(train._id.toString()) ? 0 : train.availableSeats)
            };
        });

        res.json(formattedTrains);
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ 
            message: 'Error fetching trains', 
            error: error.message 
        });
    }
});

// @desc assigns a staff to a train
router.put('/assign-staff/:trainId', async (req, res) => {
    try {
        const { trainId } = req.params;
        const { driverId, engineerId } = req.body;

        // Check if at least one staff member is provided
        if (!driverId && !engineerId) {
            return res.status(400).json({
                success: false,
                message: 'At least one staff member (driver or engineer) must be provided'
            });
        }

        // Find the train
        const train = await Train.findById(trainId);
        if (!train) {
            return res.status(404).json({
                success: false,
                message: 'Train not found'
            });
        }

        // Initialize update object
        const updateStaff = {};

        // If driverId is provided, verify driver exists and is a driver
        if (driverId) {
            const driver = await User.findOne({ 
                _id: driverId, 
                role: 'driver'
            });

            if (!driver) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid driver ID or user is not a driver'
                });
            }

            updateStaff['assignedStaff.driver'] = driverId;
        }

        // If engineerId is provided, verify engineer exists and is an engineer
        if (engineerId) {
            const engineer = await User.findOne({ 
                _id: engineerId, 
                role: 'engineer'
            });

            if (!engineer) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid engineer ID or user is not an engineer'
                });
            }

            updateStaff['assignedStaff.engineer'] = engineerId;
        }

        // Update the train with new staff assignments
        const updatedTrain = await Train.findByIdAndUpdate(
            trainId,
            { $set: updateStaff },
            { 
                new: true,
                runValidators: true 
            }
        ).populate('assignedStaff.driver assignedStaff.engineer');

        // Prepare response message
        let message = 'Staff assigned successfully: ';
        if (driverId) message += 'Driver ';
        if (driverId && engineerId) message += 'and ';
        if (engineerId) message += 'Engineer ';
        message += 'updated';

        res.status(200).json({
            success: true,
            message,
            train: {
                id: updatedTrain._id,
                nameEng: updatedTrain.nameEng,
                nameAr: updatedTrain.nameAr,
                assignedStaff: {
                    driver: updatedTrain.assignedStaff.driver ? {
                        id: updatedTrain.assignedStaff.driver._id,
                        firstName: updatedTrain.assignedStaff.driver.firstName,
                        lastName: updatedTrain.assignedStaff.driver.lastName
                    } : null,
                    engineer: updatedTrain.assignedStaff.engineer ? {
                        id: updatedTrain.assignedStaff.engineer._id,
                        firstName: updatedTrain.assignedStaff.engineer.firstName,
                        lastName: updatedTrain.assignedStaff.engineer.lastName
                    } : null
                }
            }
        });

    } catch (error) {
        console.error('Error assigning staff:', error);
        res.status(500).json({
            success: false,
            message: 'Error assigning staff to train',
            error: error.message
        });
    }
});

// @desc return all the stations in the path with arrival time
router.get('/stations', async (req, res) => {
    try {
        // Find all trains and populate source and destination stations
        const trains = await Train.find()
            .populate({
                path: 'route.source.station',
                model: 'Station'
            })
            .populate({
                path: 'route.destination.station',
                model: 'Station',
            });

        if (!trains || trains.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No trains found'
            });
        }

        // Process each train's route
        const trainsWithRoutes = await Promise.all(trains.map(async (train) => {
            const routeStations = [];
            let currentStation = train.route.source.station;
            let stationCount = 0;
            
            // Calculate total time of journey in milliseconds
            const totalJourneyTime = train.route.destination.arrivalTime - train.route.source.departureTime;
            
            while (currentStation) {
                // Add station to route
                const isSource = currentStation._id.toString() === train.route.source.station._id.toString();
                const isDestination = currentStation._id.toString() === train.route.destination.station._id.toString();
                
                let stationTime;
                if (isSource) {
                    stationTime = train.route.source.departureTime;
                } else if (isDestination) {
                    stationTime = train.route.destination.arrivalTime;
                } else {
                    // Calculate estimated time for intermediate station
                    // This assumes equal time distribution between stations
                    const progress = stationCount / (routeStations.length + 1);
                    stationTime = new Date(train.route.source.departureTime.getTime() + (totalJourneyTime * progress));
                }

                routeStations.push({
                    stationId: currentStation._id,
                    city: currentStation.city,
                    estimatedTime: stationTime,
                    type: isSource ? 'departure' : (isDestination ? 'arrival' : 'intermediate')
                });

                // If the current station is the destination, stop
                if (isDestination) {
                    break;
                }

                // Find the next station in the route
                currentStation = await Station.findById(currentStation.toStation);
                stationCount++;

                // If no next station is found, break to avoid infinite loops
                if (!currentStation) {
                    return {
                        id: train._id,
                        nameEng: train.nameEng,
                        nameAr: train.nameAr,
                        error: 'Route is incomplete. Could not find the next station.'
                    };
                }
            }

            return {
                id: train._id,
                nameEng: train.nameEng,
                nameAr: train.nameAr,
                totalStations: routeStations.length,
                stations: routeStations
            };
        }));

        res.status(200).json({
            success: true,
            trains: trainsWithRoutes
        });

    } catch (error) {
        console.error('Error fetching route stations:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching route stations',
            error: error.message
        });
    }
});


module.exports = router;