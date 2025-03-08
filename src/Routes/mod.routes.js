const express = require('express');
const { restrictTo, protect } = require('../Controllers/auth.controller');
const { getAssignedMatches, acceptMatch } = require('../Controllers/mod.controller');


const router = express.Router();

router.use(protect);
router.use(restrictTo('moderator'));

router.get('/getAssignedMatches', getAssignedMatches);
router.post('/acceptMatch', acceptMatch);

module.exports = router;