const Invoice = require('../models/invoice');
const User = require('../models/user');

exports.createInvoice = async (req, res) => {
  try {
    const userId = req.body.userId;
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User ID does not exist' });
        }
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
