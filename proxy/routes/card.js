const express = require('express');
const router = express.Router();
const cardController = require('../controller/cardController');

router.get('/cardDetails/:host/:cardid', cardController.cardDetails);
router.get('/comments/:host/:cardid', cardController.comments);
router.post('/comments/:host/:cardid', cardController.addComment);
router.patch('/moveCard/:host/:cardid', cardController.moveCard);
router.post('/addCard/:host', cardController.addCard);

module.exports = router;