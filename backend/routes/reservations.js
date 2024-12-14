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
            })
            .populate('passenger', 'nationalId');

        const formattedReservations = reservations.map(reservation => {
            const departureTime = moment(reservation.train.route.source.departureTime);
            const arrivalTime = moment(reservation.train.route.destination.arrivalTime);

            // Calculate duration
            const duration = moment.duration(arrivalTime.diff(departureTime));
            const hours = Math.floor(duration.asHours());
            const minutes = duration.minutes();
            const formattedDuration = `${hours}h ${minutes.toString().padStart(2, '0')}m`;
            const paymentDeadline = moment(reservation.paymentDeadline);

            return {
                reservationId: reservation._id,
                passengerId: reservation.passenger.nationalId,
                from: reservation.train.route.source.station.city,
                to: reservation.train.route.destination.station.city,
                date: departureTime.format('YYYY-MM-DD'),
                status: reservation.status,
                paymentDeadline: paymentDeadline.format('YYYY:MM:DD HH:mm'),
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
        })
        .populate('passenger', 'nationalId');

        if (reservations.length === 0) {
            return res.status(404).json({ 
                message: 'No reservations found for this passenger' 
            });
        }

        const formattedReservations = reservations.map(reservation => {
            const departureTime = moment(reservation.train.route.source.departureTime);
            const arrivalTime = moment(reservation.train.route.destination.arrivalTime);
            const paymentDeadline = moment(reservation.paymentDeadline);

            // Calculate duration
            const duration = moment.duration(arrivalTime.diff(departureTime));
            const hours = Math.floor(duration.asHours());
            const minutes = duration.minutes();
            const formattedDuration = `${hours}h ${minutes.toString().padStart(2, '0')}m`;

            return {
                reservationId: reservation._id,
                passengerId: reservation.passenger.nationalId,
                from: reservation.train.route.source.station.city,
                to: reservation.train.route.destination.station.city,
                date: departureTime.format('YYYY-MM-DD'),
                status: reservation.status,
                paymentDeadline: paymentDeadline.format('YYYY:MM:DD HH:mm'),
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
            email,     // Required for admin making new user 
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
            else if(!email){
                return res.status(400).json({ 
                    error: 'Email is required for admin reservations' 
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
                    email,
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

        // Check if there are any waitlisted reservations
        const existingWaitlistedReservations = await Reservation.findOne({
            train: trainId,
            status: 'waitlisted'
        });

        // Calculate reservation cost based on seat cost and number of seats
        const getDiscount = () => {
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

        // If there are waitlisted reservations or no available seats, waitlist the new reservation
        if (existingWaitlistedReservations || train.availableSeats === 0) {
            reservationData.status = 'waitlisted';
            const reservation = await Reservation.create(reservationData);

            return res.status(201).json({
                message: 'Reservation waitlisted',
                reservation
            });
        }

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

// @desc get payment details
router.get('/pay/:reservationId', async (req, res) => {
    try {

        const { reservationId } = req.params;

        const reservation = await Reservation.findById(reservationId)
            .populate('train', 'nameEng nameAr')

            reservationDetails = {
                trainEng: reservation.train.nameEng,
                trainAr: reservation.train.nameAr,
                seatsNum: reservation.seatsNum,
                cost: reservation.cost
            };

        res.json(reservationDetails);
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ 
            message: 'Error fetching reservations', 
            error: error.message 
        });
    }
});

// @desc confirms a reservation
router.put('/pay/:reservationId', async (req, res) => {
    try {
        const { reservationId } = req.params;

        // Find the reservation
        const reservation = await Reservation.findById(reservationId)
            .populate('train');

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

        // Find the highest seat number currently assigned for this train
        const highestSeatReservation = await Reservation.findOne({
            train: reservation.train._id,
            status: 'confirmed',
            seatNumbers: { $exists: true, $ne: [] }
        }).sort({ 'seatNumbers': -1 });

        let lastSeatNumber = 0;
        if (highestSeatReservation && highestSeatReservation.seatNumbers.length > 0) {
            lastSeatNumber = Math.max(...highestSeatReservation.seatNumbers);
        }

        // Generate new seat numbers
        const newSeatNumbers = [];
        for (let i = 0; i < reservation.seatsNum; i++) {
            newSeatNumbers.push(lastSeatNumber + 1 + i);
        }

        // Update reservation
        reservation.status = 'confirmed';
        reservation.seatNumbers = newSeatNumbers;
        await reservation.save();

        // Add loyalty points for the user
        const user = await User.findById(reservation.passenger)
        await user.addLoyaltyPoints(reservation.train.distance*reservation.seatsNum)

        res.json({
            message: 'Reservation confirmed successfully',
            seatNumbers: newSeatNumbers
        });

    } catch (error) {
        console.error('Error confirming reservation:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// @desc deletes a reservation
router.delete('/:reservationId', async (req, res) => {
    try {
        const { reservationId } = req.params;

        // Find the reservation and populate train details
        const reservation = await Reservation.findById(reservationId)
            .populate('train');

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        // Store reservation details before deletion
        const reservationStatus = reservation.status;
        const seatsNum = reservation.seatsNum;
        const trainId = reservation.train._id;

        // If reservation is 'confirmed' or 'pending', increase available seats
        if (reservationStatus === 'confirmed' || reservationStatus === 'pending') {
            const train = await Train.findById(trainId);
            
            if (!train) {
                return res.status(404).json({
                    success: false,
                    message: 'Associated train not found'
                });
            }

            // Increase available seats
            train.availableSeats += seatsNum;

            // Ensure availableSeats doesn't exceed totalSeats
            if (train.availableSeats > train.totalSeats) {
                train.availableSeats = train.totalSeats;
            }

            await train.save();
        }

        // Delete the reservation
        await Reservation.findByIdAndDelete(reservationId);

        res.status(200).json({
            success: true,
            message: 'Reservation deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting reservation:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting reservation',
            error: error.message
        });
    }
});

// @desc returns all waitlisted reservations given a trainId
router.get('/waitlist/:trainId', async (req, res) => {
    try {
        const { trainId } = req.params;

        // Validate trainId
        if (!mongoose.Types.ObjectId.isValid(trainId)) {
            return res.status(400).json({ error: 'Invalid train ID format' });
        }

        // Check if train exists
        const train = await Train.findById(trainId);
        if (!train) {
            return res.status(404).json({ error: 'Train not found' });
        }

        // Get all waitlisted reservations for this train
        const waitlistedReservations = await Reservation.find({
            train: trainId,
            status: 'waitlisted'
        }).populate('passenger');

        const waitlistedCount = waitlistedReservations.length;

        // Organize reservations by loyalty tier
        const reservationsByTier = {
            Gold: [],
            Silver: [],
            Green: [],
            Regular: []
        };

        // Sort reservations into their respective tiers
        waitlistedReservations.forEach(reservation => {
            const tier = reservation.passenger.loyaltyTier;
            reservationsByTier[tier].push({
                _id: reservation._id,
                passengerId: reservation.passenger._id,
                passengerName: `${reservation.passenger.firstName} ${reservation.passenger.lastName}`,
                loyaltyPoints: reservation.passenger.loyaltyPoints,
                seatsNum: reservation.seatsNum,
                createdAt: moment(reservation.createdAt).format('YYYY-MM-DD HH:mm'),
            });
        });

        // Sort each tier's reservations by creation date
        Object.keys(reservationsByTier).forEach(tier => {
            reservationsByTier[tier].sort((a, b) => a.createdAt - b.createdAt);
        });

        return res.status(200).json({
            trainId,
            waitlistedCount,
            waitlist: reservationsByTier
        });

    } catch (error) {
        console.error('Error fetching waitlist:', error);
        return res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message 
        });
    }
});

// @desc promote waitlisted reservation
router.put('/promote/:reservationId', async (req, res) => {
    try {
        // Find the reservation and populate train details
        const reservation = await Reservation.findById(req.params.reservationId)
            .populate('train');

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Verify the reservation is currently waitlisted
        if (reservation.status !== 'waitlisted') {
            return res.status(400).json({ 
                error: 'Invalid operation', 
                message: 'Only waitlisted reservations can be promoted' 
            });
        }

        const train = reservation.train;

        // Check if there are enough available seats
        if (train.availableSeats < reservation.seatsNum) {
            return res.status(400).json({ 
                error: 'Not enough seats', 
                message: `Only ${train.availableSeats} seats available` 
            });
        }

        // Update reservation status to pending
        reservation.status = 'pending';

        // Save the reservation (this will trigger the middleware to recalculate the payment deadline)
        const updatedReservation = await reservation.save();

        // Update train's available seats
        await Train.findByIdAndUpdate(
            train._id,
            { $inc: { availableSeats: -reservation.seatsNum } }
        );

        return res.status(200).json({
            message: 'Reservation promoted successfully',
            reservation: updatedReservation
        });

    } catch (error) {
        console.error('Error promoting waitlisted reservation:', error);
        return res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message 
        });
    }
});

router.put('/:reservationId', async (req, res) => {
    try {
        const { trainId, seatsNum, dependents } = req.body;
        const reservationId = req.params.reservationId;

        // Find the current reservation
        const currentReservation = await Reservation.findById(reservationId)
            .populate('train');

        if (!currentReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Can only edit pending or waitlisted reservations
        if (currentReservation.status === 'confirmed') {
            return res.status(400).json({
                error: 'Cannot edit confirmed reservations'
            });
        }

        // If changing train, validate new train
        let newTrain = currentReservation.train;
        if (trainId && trainId !== currentReservation.train._id.toString()) {
            newTrain = await Train.findById(trainId);
            if (!newTrain) {
                return res.status(404).json({ error: 'New train not found' });
            }

            // Check if train departure hasn't passed
            if (newTrain.status === 'finished') {
                return res.status(400).json({
                    error: 'Cannot change to a train that has already departed'
                });
            }
        }

        // If changing number of seats
        const newSeatsNum = seatsNum || currentReservation.seatsNum;
        
        // Check seat availability if changing train or increasing seats
        if ((trainId && trainId !== currentReservation.train._id.toString()) || 
            (newSeatsNum > currentReservation.seatsNum)) {
            
            const additionalSeatsNeeded = trainId === currentReservation.train._id.toString() 
                ? newSeatsNum - currentReservation.seatsNum 
                : newSeatsNum;

            if (currentReservation.status === 'pending' && 
                newTrain.availableSeats < additionalSeatsNeeded) {
                return res.status(400).json({
                    error: 'Not enough seats available on the train',
                    availableSeats: newTrain.availableSeats
                });
            }
        }

        // Validate dependents if provided
        if (dependents) {
            for (const dependent of dependents) {
                if (!dependent.firstName || !dependent.lastName) {
                    return res.status(400).json({
                        error: 'Each dependent must have firstName and lastName'
                    });
                }
            }
        }

        passengerUser = await User.findById(currentReservation.passenger);

        const getDiscount = () => {
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

        // Calculate cost adjustment if changing train or seats
        const newCost = newTrain.seatCost * newSeatsNum * discount;
        
        // Prepare update object
        const updateObj = {
            ...(trainId && { train: trainId }),
            ...(seatsNum && { seatsNum: newSeatsNum }),
            ...(dependents && { dependents }),
            cost: newCost
        };

        // Update the reservation
        // Using save() to trigger the payment deadline middleware
        const reservation = await Reservation.findById(reservationId);
        Object.assign(reservation, updateObj);
        const updatedReservation = await reservation.save();

        // Update seats on trains if necessary
        if (currentReservation.status === 'pending') {
            // If changing trains, update both old and new train
            if (trainId && trainId !== currentReservation.train._id.toString()) {
                // Return seats to old train
                await Train.findByIdAndUpdate(
                    currentReservation.train._id,
                    { $inc: { availableSeats: currentReservation.seatsNum } }
                );
                // Take seats from new train
                await Train.findByIdAndUpdate(
                    trainId,
                    { $inc: { availableSeats: -newSeatsNum } }
                );
            } 
            // If just changing number of seats on same train
            else if (newSeatsNum !== currentReservation.seatsNum) {
                const seatsDifference = currentReservation.seatsNum - newSeatsNum;
                await Train.findByIdAndUpdate(
                    currentReservation.train._id,
                    { $inc: { availableSeats: seatsDifference } }
                );
            }
        }

        return res.status(200).json({
            message: 'Reservation updated successfully',
            reservation: updatedReservation
        });

    } catch (error) {
        console.error('Error updating reservation:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

module.exports = router;