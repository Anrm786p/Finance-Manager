const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Paid', 'Unpaid', 'Overdue'], required: true },
  clientName: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
