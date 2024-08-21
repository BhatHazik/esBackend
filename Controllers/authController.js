const jwt = require('jsonwebtoken');
const db = require('../Config/database');
const { asyncChoke } = require("../Utils/asyncWrapper");
const AppError = require("../Utils/error");
exports.protect = asyncChoke(async(req, res, next) =>{
    let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError(401, "You are not logged in! Please log in to get access."));
  }

  try {
    const { data } = jwt.verify(token, process.env.JWT_SECRET);

    const query = `SELECT * FROM users WHERE phone_no = ?`;
    const [result] = await db.query(query, [data]);

    if (result.length === 0) {
      return next(new AppError(401, "The user belonging to this token does no longer exist."));
    }

    req.user = result[0];
    
    next();
  } catch (error) {
    next(new AppError(401, "Invalid token. Please log in again!"));
  }
})