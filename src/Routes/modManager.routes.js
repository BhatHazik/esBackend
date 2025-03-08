const express = require('express');
const { restrictTo, protect } = require('../Controllers/auth.controller');
const { assignMatches } = require('../Controllers/modManager.controller');


const router = express.Router();

router.use(protect);
router.use(restrictTo('mod-manager'));

router.post('/assignMatch', assignMatches);

module.exports = router;