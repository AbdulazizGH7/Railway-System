const mongoose = require('mongoose');  

// Base User Schema  
const userSchema = new mongoose.Schema({  
  email: {  
    type: String,  
    required: true,  
    unique: true  
  },  
  password: {  
    type: String,  
    required: true  
  },  
  firstName: String,  
  lastName: String,  
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
})
  
const User = mongoose.model('User', userSchema);  

module.exports = User