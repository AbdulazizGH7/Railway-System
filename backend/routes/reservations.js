const express = require('express');
const router = express.Router();
const moment = require('moment');
const mongoose = require('mongoose')
const Reservation = require('../models/Reservation');
const Train = require('../models/Train');
const User = require('../models/User');

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

// @desc creates a new reservation
router.post('/', async (req, res) => {
    try {
        const {
            user, 
            trainId, 
            seatsNum, 
            nationalId, // Required for admin making reservation
            firstName, // Required for admin making new user
            lastName,  // Required for admin making new user
            dependents // Optional
        } = req.body;

        const authenticatedUser = user;
        let passengerUser;

        // Handle admin creating reservation for another user
        if (authenticatedUser.role === 'admin') {
            if (!nationalId) {
                return res.status(400).json({ 
                    error: 'National ID is required for admin reservations' 
                });
            }

            // Check if user exists
            passengerUser = await User.findOne({ nationalId });

            // If user doesn't exist, create new user
            if (!passengerUser && firstName && lastName) {
                passengerUser = await User.create({
                    nationalId,
                    firstName,
                    lastName,
                    role: 'passenger'
                });
            } else if (!passengerUser) {
                return res.status(400).json({
                    error: 'User not found and insufficient information to create new user'
                });
            }
        } else {
            // For non-admin requests, passenger is the authenticated user
            passengerUser = authenticatedUser;
        }

        // Find the train and check availability
        const train = await Train.findById(trainId);
        if (!train) {
            return res.status(404).json({ error: 'Train not found' });
        }

        // Calculate reservation cost based on seat cost and number of seats
        const getDiscount = () =>{
            if(passengerUser.loyaltyTier === 'Gold')
                return 0.75
            else if(passengerUser.loyaltyTier === 'Silver')
                return 0.9
            else if(passengerUser.loyaltyTier === 'Green')
                return 0.95
            else
                return 1
        }
        const discount = getDiscount()
        const cost = train.seatCost * seatsNum * discount;

        // Create reservation object
        const reservationData = {
            passenger: passengerUser._id,
            train: trainId,
            seatsNum,
            cost,
            dependents
        };

        // Check if there are enough available seats
        if (train.availableSeats >= seatsNum) {

            if(user.role === 'admin'){
                reservationData.status = 'confirmed'
                await passengerUser.addLoyaltyPoints(train.distance);
            }
            else{
                reservationData.status = 'pending'
            }
            
            // Create the reservation
            const reservation = await Reservation.create(reservationData);

            // Update available seats
            train.availableSeats -= seatsNum;
            await train.save();

            return res.status(201).json({
                message: 'Reservation created successfully',
                reservation
            });
        } else if (train.availableSeats === 0) {
            // No seats available - create waitlisted reservation
            reservationData.status = 'waitlisted';
            const reservation = await Reservation.create(reservationData);

            return res.status(201).json({
                message: 'Reservation waitlisted',
                reservation
            });
        } else {
            // Not enough seats available
            return res.status(400).json({
                error: `Only ${train.availableSeats} seats available`
            });
        }

    } catch (error) {
        console.error('Reservation error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// @desc confirms a reservation
router.put('/pay/:reservationId', async (req, res) => {
    try {
        const { reservationId } = req.params;

        // Find the reservation
        const reservation = await Reservation.findById(reservationId)
        .populate('train')

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Check if payment deadline has passed
        const now = new Date();
        if (now > reservation.paymentDeadline) {
            return res.status(400).json({ 
                error: 'Payment deadline has passed. Cannot confirm reservation.' 
            });
        }

        // Check if train departure time has passed
        const departureTime = new Date(reservation.train.route.source.departureTime);
        if (now > departureTime) {
            return res.status(400).json({ 
                error: 'Train has already departed. Cannot confirm reservation.' 
            });
        }

        // Update reservation status to confirmed
        reservation.status = 'confirmed';
        await reservation.save();

        res.json({
            message: 'Reservation confirmed successfully',
            reservation
        });

    } catch (error) {
        console.error('Error confirming reservation:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});


module.exports = router;