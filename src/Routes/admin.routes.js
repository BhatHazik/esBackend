const express = require('express');
const { createModerator } = require('../Controllers/admin.controller');
const { restrictTo, protect } = require('../Controllers/auth.controller');


const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

router.post('/createModerator', createModerator);

module.exports = router;