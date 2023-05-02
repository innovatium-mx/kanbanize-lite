const express = require('express');
const router = express.Router();
const cardController = require('../controller/cardController');

router.get('/cardDetails/:host/:cardid', cardController.cardDetails);

module.exports = router;