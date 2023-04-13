const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/login/:host', userController.login);

module.exports = router;