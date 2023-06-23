const express = require('express');

const purchaseController = require('../controllers/purchase');

const userAuthenticate = require("../middleware/auth");

const router = express.Router();

router.get('/purchase/premiummembership', userAuthenticate.authenticate,purchaseController.purchasepremium);

router.post('/purchase/updatetransactionstatus', userAuthenticate.authenticate, purchaseController.updateTransactionStatus)

module.exports = router;