const mongoose = require('mongoose')

// Station Schema 
const stationSchema = new mongoose.Schema({  
    city: {  
      type: String,  
      required: true,  
      unique: true  
    },
    toStation:{
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Station'  
    }
}); 

const Station = mongoose.model("Station", stationSchema)

module.exports = Station