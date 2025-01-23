const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const expenseController = require("../controllers/expenseController");

router.post("", verifyToken, expenseController.createExpense);
router.get("", verifyToken, expenseController.getExpenses);
router.put("/:id", verifyToken, expenseController.updateExpense);
router.delete("/:id", verifyToken, expenseController.deleteExpense);

module.exports = router;
