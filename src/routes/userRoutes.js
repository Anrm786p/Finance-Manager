const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

router.post("/register", verifyToken, userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/get-user/:id", verifyToken, userController.getUser);
router.get('/income-report/:userId', userController.getIncomeReport);
router.get('/expense-report/:userId', userController.getExpenseReport);
router.get('/invoice-report/:userId', userController.getInvoiceReport);
router.get('/tax-report/:userId', userController.getTaxReport);

module.exports = router;
