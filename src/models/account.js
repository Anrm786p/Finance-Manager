const mongoose = require('mongoose');

const BankAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  currentBalance: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Account', BankAccountSchema);
