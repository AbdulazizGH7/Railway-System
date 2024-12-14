const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Train = require('../models/Train');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'railwayics@gmail.com',
        pass: process.env.PASS
    }
});

// Payment reminder - runs every hour
cron.schedule('0 * * * *', async () => {
    try {
        console.log('Running payment reminder job...');

        const unpaidReservations = await Reservation.find({
            status: 'pending',
            paymentDeadline: { $lt: new Date() }
        }).populate('passenger');

        for (const reservation of unpaidReservations) {
            const passenger = reservation.passenger;

            const mailOptions = {
                from: 'railwayics@gmail.com',
                to: passenger.email,
                subject: 'Payment Reminder for Your Reservation',
                text: `Dear ${passenger.firstName},\n\nYour payment for the reservation on train ${reservation.train} is overdue. Please complete your payment as soon as possible to confirm your booking.\n\nThank you!`
            };

            await transporter.sendMail(mailOptions);
            console.log(`Payment reminder email sent to ${passenger.email}`);
        }
    } catch (error) {
        console.error('Error sending payment reminders:', error);
    }
});

// Departure reminder - runs every 30 minutes
cron.schedule('*/30 * * * *', async () => {
    try {
        console.log('Running 3-hour departure reminder job...');

        const now = new Date();
        const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);

        const trainsDepartingSoon = await Train.find({
            'route.source.departureTime': {
                $gte: threeHoursFromNow,
                $lt: new Date(threeHoursFromNow.getTime() + 30 * 60 * 1000)
            }
        });

        for (const train of trainsDepartingSoon) {
            const reservations = await Reservation.find({
                train: train._id,
                status: { $in: ['confirmed', 'pending'] }
            }).populate('passenger');

            for (const reservation of reservations) {
                const passenger = reservation.passenger;

                const mailOptions = {
                    from: 'railwayics@gmail.com',
                    to: passenger.email,
                    subject: 'Reminder: Your Train Departs in 3 Hours',
                    text: `Dear ${passenger.firstName},\n\nThis is a reminder that your train (${train.name}) departs in 3 hours. Please make sure to arrive at the station on time.\n\nThank you!`
                };

                await transporter.sendMail(mailOptions);
                console.log(`Departure reminder email sent to ${passenger.email}`);
            }
        }
    } catch (error) {
        console.error('Error sending departure reminders:', error);
    }
});
