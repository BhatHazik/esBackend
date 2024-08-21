const express = require('express');
const teamController = require('../Controllers/teamController');
const userAuth = require('../Controllers/authController');
const router = express.Router();

router.get("/teamFetcher", userAuth.protect, teamController.teamFetch);





module.exports = router;