const mongoose = require('mongoose');

const TIER_THRESHOLDS = {
  GREEN: 10000,   // 10K miles
  SILVER: 50000,  // 50K miles
  GOLD: 100000    // 100K miles
};

// Base User Schema  
const userSchema = new mongoose.Schema({ 
  nationalId:{
    type: Number,
    unique: true,
    required: true,
    validate: {
      validator: function(v) {
          return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid national ID!`
    }
  }, 
  email: {  
    type: String,  
    sparse: true,
    unique: true,
    lowercase: true,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
  }
  },  
  password: {  
    type: String  
  },  
  firstName:{
    type: String,
    required: true
  },  
  lastName: {
    type: String,
    required: true
  },  
  role: {  
    type: String,
    enum: ['passenger', 'admin', 'driver', 'engineer'],  
    default: 'passenger',   
    required: true  
  },
  loyaltyPoints: {  
    type: Number,  
    default: 0  
  },
  loyaltyTier: {
    type: String,
    enum: ['Regular', 'Green', 'Silver','Gold'],
    default: "Regular"
  }    
})

userSchema.pre('save', function(next) {
  // Update loyalty tier based on points
  if (this.loyaltyPoints >= TIER_THRESHOLDS.GOLD) {
    this.loyaltyTier = 'Gold';
  } else if (this.loyaltyPoints >= TIER_THRESHOLDS.SILVER) {
    this.loyaltyTier = 'Silver';
  } else if (this.loyaltyPoints >= TIER_THRESHOLDS.GREEN) {
    this.loyaltyTier = 'Green';
  } else {
    this.loyaltyTier = "Regular";
  }
  next();
});

userSchema.methods.addLoyaltyPoints = function(points) {
  this.loyaltyPoints += points;
  return this.save(); // This will trigger the pre-save middleware
};
  
const User = mongoose.model('User', userSchema);  

module.exports = User;