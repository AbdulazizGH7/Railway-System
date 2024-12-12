const express = require('express');
const router = express.Router();
const moment = require('moment');
const mongoose = require('mongoose')
const Reservation = require('../models/Reservation');

// @desc returns all the reservations
router.get('/', async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate({
                path: 'train',
                populate: {
                    path: 'route.source.station route.destination.station',
                    select: 'city'
                }
            });

        const formattedReservations = reservations.map(reservation => {
            const departureTime = moment(reservation.train.route.source.departureTime);
            const arrivalTime = moment(reservation.train.route.destination.arrivalTime);

            // Calculate duration
            const duration = moment.duration(arrivalTime.diff(departureTime));
            const hours = Math.floor(duration.asHours());
            const minutes = duration.minutes();
            const formattedDuration = `${hours}h ${minutes.toString().padStart(2, '0')}m`;

            return {
                reservationId: reservation._id,
                passengerId: reservation.passenger._id,
                from: reservation.train.route.source.station.city,
                to: reservation.train.route.destination.station.city,
                date: departureTime.format('YYYY-MM-DD'),
                status: reservation.status,
                departureTime: departureTime.format('HH:mm'),
                arrivalTime: arrivalTime.format('HH:mm'),
                duration: formattedDuration
            };
        });

        res.json(formattedReservations);
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ 
            message: 'Error fetching reservations', 
            error: error.message 
        });
    }
});

// @desc returns all the reservations for a passenger
router.get('/:passengerId', async (req, res) => {
    try {
        // Validate passengerId format
        if (!mongoose.Types.ObjectId.isValid(req.params.passengerId)) {
            return res.status(400).json({ message: 'Invalid passenger ID format' });
        }

        const reservations = await Reservation.find({
            passenger: req.params.passengerId
        })
        .populate({
            path: 'train',
            populate: {
                path: 'route.source.station route.destination.station',
                select: 'city'
            }
        });

        if (reservations.length === 0) {
            return res.status(404).json({ 
                message: 'No reservations found for this passenger' 
            });
        }

        const formattedReservations = reservations.map(reservation => {
            const departureTime = moment(reservation.train.route.source.departureTime);
            const arrivalTime = moment(reservation.train.route.destination.arrivalTime);

            // Calculate duration
            const duration = moment.duration(arrivalTime.diff(departureTime));
            const hours = Math.floor(duration.asHours());
            const minutes = duration.minutes();
            const formattedDuration = `${hours}h ${minutes.toString().padStart(2, '0')}m`;

            return {
                reservationId: reservation._id,
                passengerId: reservation.passenger._id,
                from: reservation.train.route.source.station.city,
                to: reservation.train.route.destination.station.city,
                date: departureTime.format('YYYY-MM-DD'),
                status: reservation.status,
                departureTime: departureTime.format('HH:mm'),
                arrivalTime: arrivalTime.format('HH:mm'),
                duration: formattedDuration
            };
        });

        res.json(formattedReservations);

    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ 
            message: 'Error fetching reservations', 
            error: error.message 
        });
    }
});




module.exports = router;