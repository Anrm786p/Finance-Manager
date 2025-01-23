const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const accountController = require("../controllers/accountController");

router.post("", verifyToken, accountController.createAccount);
router.get("", verifyToken, accountController.getAccounts);
router.put("/:id", verifyToken, accountController.updateAccount);
router.delete("/:id", verifyToken, accountController.deleteAccount);

module.exports = router;
