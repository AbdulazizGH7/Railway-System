const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const PORT = 8000

const app = express()
app.use(cors());
app.use(express.json())

mongoose.connect("mongodb+srv://admin:admin@thevault.p73el.mongodb.net/Railway?retryWrites=true&w=majority&appName=TheVault  ")
.then(()=>{
    console.log("Connected to the DB")
    app.listen(PORT, () =>{
        console.log("Server is running on port", PORT)
    })
})
.catch((err) =>{
    console.log("Failed to connect to the DB", err)
})
