const express = require('express');
const transactionController = require('../controllers/transactionController');

const router = new express.Router();

router.get('/snipping', transactionController.snipping);

module.exports = router;