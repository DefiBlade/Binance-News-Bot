const express = require('express');
const BotController = require('../controllers/botController');

const router = new express.Router();

router.post('/startSnipping', BotController.startSnipping);
router.post('/stopSnipping', BotController.stopSnipping);
router.get('/getSnippingStatus', BotController.getSnippingStatus);
router.post('/getBalance', BotController.getBalance);
router.post('/buyCoin', BotController.buyCoin);
router.post('/sellCoin', BotController.sellCoin);


module.exports = router;