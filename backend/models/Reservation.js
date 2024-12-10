const mongoose = require('mongoose')  

// Reservation Schema    
const reservationSchema = new mongoose.Schema({    
    passenger: {    
      type: mongoose.Schema.Types.ObjectId,    
      ref: 'User',    
      required: true    
    },    
    train: {    
      type: mongoose.Schema.Types.ObjectId,    
      ref: 'Train',    
      required: true    
    },  
    seatsNum: Number,   
    status: {    
      type: String,    
      enum: ['confirmed', 'pending', 'waitlisted'],    
      default: 'pending'    
    },       
    paymentDeadline: Date,    
    cost: Number,    
    createdAt: {    
      type: Date,    
      default: Date.now    
    }    
});    

// pre-save middleware to set payment deadline  
reservationSchema.pre('save', async function(next) {  
    if (!this.paymentDeadline) {  
        try {  
            // Populate the train reference to access departure time  
            const train = await mongoose.model('Train').findById(this.train);  
            if (train) {  
                // Set payment deadline to one day before departure  
                const departureTime = new Date(train.route.source.departureTime);  
                this.paymentDeadline = new Date(departureTime.setDate(departureTime.getDate() - 1));  
            }  
        } catch (error) {  
            return next(error);  
        }  
    }  
    next();  
});  

const Reservation = mongoose.model("Reservation", reservationSchema)  

module.exports = Reservation  