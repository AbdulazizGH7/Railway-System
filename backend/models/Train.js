const mongoose = require('mongoose')
  
// Train Schema  
const trainSchema = new mongoose.Schema({  
    nameEng: String,
    nameAr: String,
    distance: Number,
    seatCost: Number,
    totalSeats: Number,
    availableSeats:{
      type: Number,
      default: function(){
        return this.totalSeats
      }
    },
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
    assignedStaff:{
      driver:{
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User'
      },
      engineer:{
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User'
      }
    } 
}) 

const Train = mongoose.model("Train", trainSchema)

module.exports = Train