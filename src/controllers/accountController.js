const Account = require("../models/account");
const User = require("../models/user");

exports.createAccount = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User ID does not exist" });
    }
    const account = new Account(req.body);
    await account.save();
    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id });
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
