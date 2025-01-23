const Income = require("../models/income");
const User = require("../models/user");

exports.createIncome = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User ID does not exist" });
    }
    const income = new Income(req.body);
    await income.save();
    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) {
      return res.status(404).json({ error: "Income not found" });
    }
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
