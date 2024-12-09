const mongoose = require('mongoose')
  
// Train Schema  
const trainSchema = new mongoose.Schema({  
    nameEng: String,
    nameAr: String,
    totalSeats: Number,
    distance: Number,  
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
    //   intermediateStations: [{  
    //     station: {  
    //       type: mongoose.Schema.Types.ObjectId,  
    //       ref: 'Station'  
    //     },  
    //     arrivalTime: Date,  
    //     departureTime: Date,  
    //   }]  
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