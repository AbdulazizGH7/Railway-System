const express = require('express');
const router = express.Router();
const moment = require('moment');
const Train = require('../models/Train');
const Reservation = require('../models/Reservation');
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

router.get('/', async (req, res) => {
    try {
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
        const formattedTrains = trains.map(train => ({
            from: train.route.source.station.city,
            to: train.route.destination.station.city,
            trainNameEng: train.nameEng,
            trainNameAr: train.nameAr,
            date: moment(train.route.source.departureTime).format('YYYY-MM-DD'),
            departureTime: moment(train.route.source.departureTime).format('HH:mm'),
            arrivalTime: moment(train.route.destination.arrivalTime).format('HH:mm'),
            // Show 0 seats if train has waitlisted reservations
            availableSeats: waitlistedTrainIds.has(train._id.toString()) ? 0 : train.availableSeats
        }));

        res.json(formattedTrains);
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ 
            message: 'Error fetching trains', 
            error: error.message 
        });
    }
});

module.exports = router;