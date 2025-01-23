const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const invoiceController = require("../controllers/invoiceController");

router.post("", verifyToken, invoiceController.createInvoice);
router.get("", verifyToken, invoiceController.getInvoices);

module.exports = router;
