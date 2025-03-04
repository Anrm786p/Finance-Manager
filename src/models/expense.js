const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true }, // E.g., "Office Supplies", "Travel"
  date: { type: Date, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
