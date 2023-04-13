const express = require('express');
const router = express.Router();
const boardController = require('../controller/boardController');

router.get('/workSpaces/:host', boardController.workSpaces);
router.get('/boards/:host/:workspaceid', boardController.boards);
router.get('/boardDetails/:host/:boardid', boardController.boardDetails);

module.exports = router;