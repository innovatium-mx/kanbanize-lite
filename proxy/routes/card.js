const express = require('express');
const router = express.Router();
const cardController = require('../controller/cardController');

router.get('/cardDetails/:host/:cardid', cardController.cardDetails);
router.get('/comments/:host/:cardid', cardController.comments);
router.patch('/moveCard/:host/:cardid', cardController.moveCard);

module.exports = router;