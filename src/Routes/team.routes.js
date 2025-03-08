const express = require('express');
const { protect, restrictTo } = require('../Controllers/auth.controller');
const { createTeam, removeUserFromTeam, addUserToTeam } = require('../Controllers/team.controller');
const router = express.Router();


router.use(protect);
router.use(restrictTo('user'));


router.post('/createTeam', createTeam);
router.patch('/addUser', addUserToTeam);
router.patch('/kickUser', removeUserFromTeam);


module.exports = router;