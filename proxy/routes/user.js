const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/login/:host', userController.login);
router.get('/checkToken/:host', userController.checkToken);

module.exports = router;