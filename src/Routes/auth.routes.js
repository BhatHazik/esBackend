const express = require('express');
const { verifyEmail, otpVerifier, loginUser, adminLogin} = require('../Controllers/auth.controller');
const router = express.Router();

router.post('/admin/login', adminLogin);
router.post('/verifyEmail', verifyEmail);
router.post('/login', loginUser);
router.post('/verifyOTP', otpVerifier);

module.exports = router;