const express = require('express');
const router = express.Router();
const boardController = require('../controller/boardController');

router.get('/boards/:host/:userid', boardController.boards);

module.exports = router;