const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, 
  firstName: { type: String, required: true },
  lastName: { type: String, required: true }, 
  type: { type: String, required: true }, // Type of user (e.g., 'freelancer', 'manager etc')
  password: { type: String, required: true }, // Hashed password
  createdAt: { type: Date, default: Date.now }, // Auto-populated timestamp
  updatedAt: { type: Date, default: Date.now }, // Auto-updated timestamp
}, { timestamps: true }); 

module.exports = mongoose.model('User', userSchema);
