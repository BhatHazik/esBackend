const express = require('express');
const bodyParser = require('body-parser');
const {sendErrorRes} = require('./src/Controllers/error.controller');
const cors = require('cors');
const corsOptions = require('./src/Config/corsConfig');
const router = require('./src/Routes/routes');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/', router);
app.use(sendErrorRes);

module.exports = app;