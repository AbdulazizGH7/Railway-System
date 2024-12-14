const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// Signup endpoint
router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, nationalId, email, password } = req.body;

        let errors = {
            nationalIdTaken: false,
            emailTaken: false,
        };

        // Validate National ID
        const nationalIdExists = await User.findOne({ nationalId });
        if (nationalIdExists) {
            errors.nationalIdTaken = true;
        }

        // Validate email
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            errors.emailTaken = true;
        }

        // If there are errors, return the error object
        if (errors.nationalIdTaken || errors.emailTaken) {
            return res.status(400).json(errors);
        }

        // Validate National ID format (10 digits)
        if (!/^\d{10}$/.test(nationalId)) {
            return res.status(400).json({
                message: 'National ID must be exactly 10 digits'
            });
        }

        // If no errors, create and save the new user
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            firstName,
            lastName,
            nationalId,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                _id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                nationalId: newUser.nationalId,
                email: newUser.email,
                role: newUser.role,
                loyaltyPoints: newUser.loyaltyPoints,
                loyaltyTier: newUser.loyaltyTier
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            message: 'An error occurred during registration'
        });
    }
});

module.exports = router;