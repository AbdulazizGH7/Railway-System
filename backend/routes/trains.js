const express = require('express');
const router = express.Router();
const moment = require('moment');
const Train = require('../models/Train');
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
            }
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

module.exports = router;