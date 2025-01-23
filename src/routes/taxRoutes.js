const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const taxController = require("../controllers/taxController");

router.post("", verifyToken, taxController.createTax);
router.get("", verifyToken, taxController.getTaxes);

module.exports = router;
