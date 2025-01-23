const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Income = require("../models/income");
const Expense = require("../models/expense");
const Tax = require("../models/tax");
const Invoice = require("../models/invoice");
const mongoose = require('mongoose');
const quarterUtils = require('../utils/quarterUtils')
//registering a user on finance app
exports.registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, type } = req.body;
    const salt = await bcrypt.genSalt(10); // generate a salt
    const hashedPassword = await bcrypt.hash(password, salt);
    const passwordRegex = /^(?=.*\d).{8,}$/; // At least 8 characters and at least one number
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one number.",
      });
    }
    const newUser = new User({
      email,
      firstName,
      lastName,
      type,
      password: hashedPassword,
    });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully!", userId: newUser._id });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return res
        .status(409)
        .json({ message: "User with this email already exists!" });
    }

    res.status(500).send({
      message: "An error occurred during registration",
      error: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send({ message: "Invalid credentials" });
    }
    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).send({
      token,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne(
      {
        _id: id,
      },
      "-password"
    );
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


exports.getIncomeReport = async (req, res) => {
  const { userId } = req.params;

  try {
    // Get the current date and calculate the quarter
    const { currentQuarterStart, currentQuarterEnd, lastQuarterStart, lastQuarterEnd } = quarterUtils.getQuarters();

    // Fetch all incomes for the current quarter
    const currentQuarterIncome = await Income.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(userId), 
          date: { $gte: currentQuarterStart, $lte: currentQuarterEnd } 
        }
      },
      { 
        $group: { 
          _id: { $dayOfYear: "$date" }, 
          totalIncome: { $sum: "$amount" } 
        } 
      },
      {
        $project: {
          day: "$_id",  
          totalIncome: 1, 
          _id: 0  
        }
      },
      { 
        $sort: { day: 1 } 
      }
    ]);

    // Calculate total income for the current quarter
    const totalCurrentQuarterIncome = currentQuarterIncome.reduce((sum, income) => sum + income.totalIncome, 0);

    // Fetch all incomes for the last quarter
    const lastQuarterIncome = await Income.aggregate([
      { $match: { userId: mongoose.Types.ObjectId.createFromHexString(userId), date: { $gte: lastQuarterStart, $lte: lastQuarterEnd } } },
      { $group: { _id: { $dayOfYear: "$date" }, totalIncome: { $sum: "$amount" } } },
      { $sort: { "_id": 1 } }
    ]);

    // Calculate total income for the last quarter
    const totalLastQuarterIncome = lastQuarterIncome.reduce((sum, income) => sum + income.totalIncome, 0);


    // Response structure
    res.json({
      currentQuarterIncome,
      totalCurrentQuarterIncome,
      lastQuarterIncome: totalLastQuarterIncome,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving income report' });
  }
};



exports.getExpenseReport = async (req, res) => {
  const { userId } = req.params;

  try {
    // Get the current and last quarter dates
    const { currentQuarterStart, currentQuarterEnd, lastQuarterStart, lastQuarterEnd } = quarterUtils.getQuarters();

    // Fetch and process expense data for the current quarter
    const currentQuarterExpenses = await Expense.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId.createFromHexString(userId),
          date: { $gte: currentQuarterStart, $lte: currentQuarterEnd },
        },
      },
      {
        $group: {
          _id: { $dayOfYear: "$date" },
          totalExpense: { $sum: "$amount" },
        },
      },
      {
        $project: {
          day: "$_id",
          totalExpense: 1,
          _id: 0,
        },
      },
      { $sort: { day: 1 } },
    ]);

    const totalCurrentQuarterExpenses = currentQuarterExpenses.reduce(
      (sum, expense) => sum + expense.totalExpense,
      0
    );

    // Fetch and process expense data for the last quarter
    const lastQuarterExpenses = await Expense.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId.createFromHexString(userId),
          date: { $gte: lastQuarterStart, $lte: lastQuarterEnd },
        },
      },
      {
        $group: {
          _id: { $dayOfYear: "$date" },
          totalExpense: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalLastQuarterExpenses = lastQuarterExpenses.reduce(
      (sum, expense) => sum + expense.totalExpense,
      0
    );

    // Calculate percentage increase from last quarter
    const expenseIncreasePercentage = totalLastQuarterExpenses
      ? ((totalCurrentQuarterExpenses - totalLastQuarterExpenses) / totalLastQuarterExpenses) * 100
      : 0;

    // Response structure
    res.json({
      currentQuarterExpenses,
      totalCurrentQuarterExpenses,
      expenseIncreasePercentage,
      lastQuarterExpenses: totalLastQuarterExpenses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving expense report' });
  }
};


exports.getTaxReport = async (req, res) => {
  const { userId } = req.params;

  try {
    // Get the current and last quarter dates
    const { currentQuarterStart, currentQuarterEnd, lastQuarterStart, lastQuarterEnd } = quarterUtils.getQuarters();

    // Fetch and process tax data for the current quarter
    const currentQuarterTaxes = await Tax.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId.createFromHexString(userId),
          date: { $gte: currentQuarterStart, $lte: currentQuarterEnd },
        },
      },
      {
        $group: {
          _id: { $dayOfYear: "$date" },
          totalTax: { $sum: "$amount" },
        },
      },
      {
        $project: {
          day: "$_id",
          totalTax: 1,
          _id: 0,
        },
      },
      { $sort: { day: 1 } },
    ]);

    const totalCurrentQuarterTaxes = currentQuarterTaxes.reduce(
      (sum, tax) => sum + tax.totalTax,
      0
    );

    // Fetch and process tax data for the last quarter
    const lastQuarterTaxes = await Tax.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId.createFromHexString(userId),
          date: { $gte: lastQuarterStart, $lte: lastQuarterEnd },
        },
      },
      {
        $group: {
          _id: { $dayOfYear: "$date" },
          totalTax: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalLastQuarterTaxes = lastQuarterTaxes.reduce(
      (sum, tax) => sum + tax.totalTax,
      0
    );

    // Calculate percentage increase from last quarter
    const taxIncreasePercentage = totalLastQuarterTaxes
      ? ((totalCurrentQuarterTaxes - totalLastQuarterTaxes) / totalLastQuarterTaxes) * 100
      : 0;

    // Response structure
    res.json({
      currentQuarterTaxes,
      totalCurrentQuarterTaxes,
      taxIncreasePercentage,
      lastQuarterTaxes: totalLastQuarterTaxes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving tax report' });
  }
};


exports.getInvoiceReport = async (req, res) => {
  const { userId } = req.params;

  try {
    // Get the current and last quarter dates
    const { currentQuarterStart, currentQuarterEnd, lastQuarterStart, lastQuarterEnd } = quarterUtils.getQuarters();

    // Fetch and process invoice data for the current quarter
    const currentQuarterInvoices = await Invoice.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId.createFromHexString(userId),
          date: { $gte: currentQuarterStart, $lte: currentQuarterEnd },
        },
      },
      {
        $group: {
          _id: { $dayOfYear: "$date" },
          totalInvoiceAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          day: "$_id",
          totalInvoiceAmount: 1,
          _id: 0,
        },
      },
      { $sort: { day: 1 } },
    ]);

    const totalCurrentQuarterInvoices = currentQuarterInvoices.reduce(
      (sum, invoice) => sum + invoice.totalInvoiceAmount,
      0
    );

    // Fetch and process invoice data for the last quarter
    const lastQuarterInvoices = await Invoice.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId.createFromHexString(userId),
          date: { $gte: lastQuarterStart, $lte: lastQuarterEnd },
        },
      },
      {
        $group: {
          _id: { $dayOfYear: "$date" },
          totalInvoiceAmount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalLastQuarterInvoices = lastQuarterInvoices.reduce(
      (sum, invoice) => sum + invoice.totalInvoiceAmount,
      0
    );

    // Calculate percentage increase from last quarter
    const invoiceIncreasePercentage = totalLastQuarterInvoices
      ? ((totalCurrentQuarterInvoices - totalLastQuarterInvoices) / totalLastQuarterInvoices) * 100
      : 0;

    // Response structure
    res.json({
      currentQuarterInvoices,
      totalCurrentQuarterInvoices,
      invoiceIncreasePercentage,
      lastQuarterInvoices: totalLastQuarterInvoices,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving invoice report' });
  }
};



