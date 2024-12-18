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

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                error: 'Please provide both email and password'
            });
        }

        // Find user by email (case-insensitive)
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({
                error: 'Invalid email or password'
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                error: 'Invalid email or password'
            });
        }

        // Return user data
        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                nationalId: user.nationalId,
                email: user.email,
                role: user.role,
                loyaltyPoints: user.loyaltyPoints,
                loyaltyTier: user.loyaltyTier
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'An error occurred during login'
        });
    }
});

module.exports = router;