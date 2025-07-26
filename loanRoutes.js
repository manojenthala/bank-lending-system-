const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

router.post('/lend', loanController.lendMoney);
router.get('/loan/:loan_id/ledger', loanController.getLoanLedger);
router.post('/payment', loanController.makePayment);
router.get('/account-overview/:customer_id', loanController.getAccountOverview);


module.exports = router;
