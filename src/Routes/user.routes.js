const express = require('express');
const { protect, restrictTo } = require('../Controllers/auth.controller');
const { getUserDashboard, getAvailableMatches, joinMatch } = require('../Controllers/user.controller');
const router = express.Router();


router.use(protect);
router.use(restrictTo('user'));


router.get('/userDashboard', getUserDashboard);
router.get('/getAvalableMatches', getAvailableMatches);
router.post('/joinMatch', joinMatch);

module.exports = router;