const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const incomeController = require("../controllers/incomeController");

router.post("", verifyToken, incomeController.createIncome);
router.get("", verifyToken, incomeController.getIncomes);
router.put("/:id", verifyToken, incomeController.updateIncome);
router.delete("/:id", verifyToken, incomeController.deleteIncome);

module.exports = router;
