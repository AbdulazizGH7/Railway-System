const express = require('express');
const router = express.Router();
const User = require('../models/User');

//@desc GET all drivers (first and last names only)
router.get('/drivers', async (req, res) => {
    try {
        const drivers = await User.find({ role: 'driver' })
            .select('firstName lastName') 

        if (!drivers.length) {
            return res.status(404).json({
                success: false,
                message: 'No drivers found'
            });
        }

        res.status(200).json({
            success: true,
            drivers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving drivers',
            error: error.message
        });
    }
});

//@desc GET all engineers (first and last names only)
router.get('/engineers', async (req, res) => {
    try {
        const engineers = await User.find({ role: 'engineer' })
            .select('firstName lastName') 

        if (!engineers.length) {
            return res.status(404).json({
                success: false,
                message: 'No engineers found'
            });
        }

        res.status(200).json({
            success: true,
            engineers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving engineers',
            error: error.message
        });
    }
});

module.exports = router;