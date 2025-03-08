const express = require('express');
const router = express.Router();
const teamRouter = require('./team.routes');
const userRouter = require('./user.routes');
const authRouter = require('./auth.routes');
const adminRouter = require('./admin.routes');
const modManagerRouter = require('./modManager.routes');
const moderatorRouter = require('./mod.routes');


router.use('/api/admin', adminRouter);
router.use('/api/auth', authRouter);
router.use('/api/user', userRouter);
router.use('/api/team', teamRouter);
router.use('/api/modManager', modManagerRouter);
router.use('/api/moderator', moderatorRouter);



module.exports = router;