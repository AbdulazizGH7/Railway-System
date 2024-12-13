const express = require('express');
const router = express.Router();
const User = require('../models/User');

//@desc GET all drivers and engineers (first and last names only)
router.get('/staff', async (req, res) => {
    try {
        // Fetch both drivers and engineers in parallel using Promise.all
        const [drivers, engineers] = await Promise.all([
            User.find({ role: 'driver' }).select('firstName lastName'),
            User.find({ role: 'engineer' }).select('firstName lastName')
        ]);

        const response = {
            success: true,
            drivers,
            engineers
        };

        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving staff members',
            error: error.message
        });
    }
});

module.exports = router;