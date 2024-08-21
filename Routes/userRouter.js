const express = require('express');
const userController = require('../Controllers/userController');
const userAuth = require('../Controllers/authController');
const router = express.Router();

// crud for users
router.post('/userOTP', userController.userOTPsender);
router.post('/userRegisterVerify', userController.verifyRegisterOTP);
router.post('/userLoginOTP', userController.userLoginSendOTP);
router.post('/userLoginVerifyOTP', userController.userLoginVerifyOTP);

module.exports = router;