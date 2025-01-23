const Tax = require('../models/tax');
const User = require('../models/user');


exports.createTax = async (req, res) => {
  try {
    const userId = req.body.userId;
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User ID does not exist' });
        }
    const tax = new Tax(req.body);
    await tax.save();
    res.status(201).json(tax);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getTaxes = async (req, res) => {
  try {
    const taxes = await Tax.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json(taxes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
