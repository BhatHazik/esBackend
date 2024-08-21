const express = require('express');
const teamRouter = require('./Routes/teamRouter');
const dotenv = require('dotenv');
dotenv.config({path: "./config.env"});
const bodyParser = require('body-parser');
const sendOTP = require('./Controllers/userController');
const {sendErrorRes} = require('./Controllers/errorController');
const userRouter = require('./Routes/userRouter');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());

const allowedOrigins = [
  "http://localhost:5173",    
  "http://localhost:8081",   
  "http://localhost:8082",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.options("*", cors());



app.use('/api/user', userRouter);
app.use('/api/team', teamRouter)








app.use(sendErrorRes);



const PORT = 4000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  