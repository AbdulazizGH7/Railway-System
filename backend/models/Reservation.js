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
    dependents:[{
      _id: false,
      firstName: String,
      lastName: String
    }],
    seatNumbers: [{
      type: Number
    }],
    paymentReminder:{
      type:Boolean,
      default: false
    },
    departureReminder:{
      type:Boolean,
      default: false
    },  
    createdAt: {    
      type: Date,    
      default: Date.now    
    }    
});    

// pre-save middleware to set payment deadline  
reservationSchema.pre('save', async function(next) {
  try {
      // Populate the train reference to access departure time
      const train = await mongoose.model('Train').findById(this.train);
      if (!train) {
          throw new Error('Train not found');
      }

      const now = new Date();
      const departureTime = new Date(train.route.source.departureTime);
      const oneDayBeforeDeparture = new Date(departureTime);
      oneDayBeforeDeparture.setDate(departureTime.getDate() - 1);

      // If no payment deadline is set or existing deadline needs validation
      if (!this.paymentDeadline || this.isModified('paymentDeadline')) {
          // Case 1: If booking is made more than 24 hours before departure
          if (departureTime - now > 24 * 60 * 60 * 1000) {
              this.paymentDeadline = oneDayBeforeDeparture;
          }
          // Case 2: If booking is made within 24 hours of departure
          else if (departureTime > now) {
              // Set deadline to 2 hours from now or departure time (whichever is sooner)
              const twoHoursFromNow = new Date(now.getTime() + (2 * 60 * 60 * 1000));
              this.paymentDeadline = twoHoursFromNow < departureTime 
                  ? twoHoursFromNow 
                  : new Date(departureTime.getTime() - (30 * 60 * 1000)); // 30 minutes before departure
          }
          // Case 3: If departure time has passed
          else {
              throw new Error('Cannot make reservation for past departure times');
          }
      }

      // Final validation
      if (this.paymentDeadline <= now) {
          throw new Error('Payment deadline cannot be in the past');
      }
      if (this.paymentDeadline > departureTime) {
          throw new Error('Payment deadline cannot be after departure time');
      }

      next();
  } catch (error) {
      next(error);
  }
});

const Reservation = mongoose.model("Reservation", reservationSchema)  

module.exports = Reservation
