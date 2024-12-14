const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const trains = require('./routes/trains')
const reservations = require('./routes/reservations')
const users = require('./routes/users')
const TrainStatusUpdater = require('./services/trainStatusUpdater');
require('./services/reminderService');
const auth = require('./routes/auth')
const PORT = process.env.PORT || 9000

const app = express()
app.use(cors());
app.use(express.json())

mongoose.connect(process.env.DB_LINK)
.then(()=>{
    console.log("Connected to the DB")
    app.listen(PORT, () =>{
        console.log("Server is running on port", PORT)
    })
    TrainStatusUpdater.init()
    app.use('/api/auth', auth)
    app.use('/api/trains', trains)
    app.use('/api/reservations', reservations)
    app.use('/api/users', users)
})
.catch((err) =>{
    console.log("Failed to connect to the DB", err)
})


