const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
//const middleware = require('../middleware/jwt-middleware');

router.post('/login', userController.login);

module.exports = router;