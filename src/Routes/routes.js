const express = require('express');
const router = express.Router();
// const teamRouter = require('./team.routes');
// const modRouter = require('./mod.routes');
// const userRouter = require('./user.routes');
const authRouter = require('./auth.routes');

router.use('/api/auth', authRouter)
// app.use('/api/user', userRouter);
// app.use('/api/team', teamRouter);
// app.use('/api/mod', modRouter);



module.exports = router;