const express = require('express');
const router = express.Router();
const attachmentController = require('../controller/attachmentController');

router.post('/uploadAttachment/:host', attachmentController.uploadAttachment);

module.exports = router;