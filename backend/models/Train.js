const mongoose = require('mongoose')
  
// Train Schema  
const trainSchema = new mongoose.Schema({  
    nameEng: String,
    nameAr: String,
    totalSeats: Number,
    distance: Number,
    seatCost: Number,
    status:{
      type: String,
      enum: ['active', 'finished'],  
      default: 'active',   
      required: true  
    },  
    route: {  
      source: {  
        station: {  
          type: mongoose.Schema.Types.ObjectId,  
          ref: 'Station',  
          required: true  
        },  
        departureTime: {  
          type: Date,  
          required: true  
        }  
      },  
      destination: {  
        station: {  
          type: mongoose.Schema.Types.ObjectId,  
          ref: 'Station',  
          required: true  
        },  
        arrivalTime: {  
          type: Date,  
          required: true  
        }  
      },
    }, 
    assignedStaff: [{  
      staff: {  
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User'  
      },  
      date: Date,
    }] 
}) 

const Train = mongoose.model("Train", trainSchema)

module.exports = Train


    //   intermediateStations: [{  
    //     station: {  
    //       type: mongoose.Schema.Types.ObjectId,  
    //       ref: 'Station'  
    //     },  
    //     arrivalTime: Date,  
    //     departureTime: Date,  
    //   }]  