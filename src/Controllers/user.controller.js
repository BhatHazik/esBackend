// const db = require("../Models/connection");
// const { catchAsync } = require("../Utils/catchAsync");
// const AppError = require("../Utils/error");

// const bcrypt = require("bcrypt");
// const {
//   createService,
//   createVerification,
//   createVerificationCheck,
// } = require("../Utils/twilio");
// const { createSendToken } = require("../Utils/helpers");
// // const { response } = require("express");

// // SIGNUP send OTP
// exports.userOTPsender = catchAsync(async (req, res, next) => {
//   const { phone, email, game, password } = req.body;
//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   if (!phone) {
//     return next(new AppError(401, "Phone Number Required!"));
//   }
//   const phoneRegex = /^[0-9]{10}$/;

//   if (!phoneRegex.test(phone)) {
//     return next(new AppError(401, "Provide a valid 10-digit phone number!"));
//   }
//   if (!email) {
//     return next(new AppError(401, "Please provide your email address!"));
//   }
//   if (!validateEmail(email)) {
//     return next(new AppError(401, "Invalid email format"));
//   }
//   if (!game) {
//     return next(new AppError(401, "select an game!"));
//   }
//   if (!password) {
//     return next(new AppError(401, "Password Required!"));
//   }
//   if (password.length < 8) {
//     return next(
//       new AppError(401, "Password must be at least 8 characters long!")
//     );
//   }

//   const userCheckQuery = "SELECT * FROM users WHERE phone = ?";
//   const userCheckValue = [phone];
//   const [userCheck] = await db.query(userCheckQuery, userCheckValue);

//   if (userCheck.length > 0) {
//     return next(new AppError(403, "User already exists!"));
//   }

//   // const sendOTP = await createVerification(phone)
//   // return res.status(200).json({
//   //   sendOTP
//   // })
//   const otpchecquery = "SELECT * FROM otps WHERE phone = ?";
//   const otpcheckvalue = [phone];
//   const [optexists] = await db.query(otpchecquery, otpcheckvalue);
//   const generateOTP = () => Math.floor(1000 + Math.random() * 9000);
//   if (optexists.length > 0) {
//     const otp = generateOTP();
//     const [saveOTP] = await db.query(
//       `UPDATE otps SET otp = ? WHERE phone = ?`,
//       [otp, phone]
//     );
//     if (saveOTP.affectedRows < 0) {
//       return next(new AppError(401, "Error in sending OTP on your number!"));
//     }

//     return res.status(200).json({
//       status: "succuss",
//       message: `OTP has been sent to ${phone}`,
//       OTP: `${otp}`,
//     });
//   }

//   const otp = generateOTP();
//   const [saveOTP] = await db.query(
//     `INSERT INTO otps (otp, phone) VALUES (?,?)`,
//     [otp, phone]
//   );
//   if (saveOTP.affectedRows < 0) {
//     return next(new AppError(401, "Error in sending OTP on your number!"));
//   }

//   return res.status(200).json({
//     status: "succuss",
//     message: `OTP has been sent to ${phone}`,
//     OTP: `${otp}`,
//   });
// });

// exports.verifyRegisterOTP = catchAsync(async (req, res, next) => {
//   const { givenOTP, phone, email, game, password } = req.body;
//   // const {  } = req.params;
//   if (!givenOTP) {
//     return next(new AppError(401, "Provide OTP!"));
//   }
//   if (!phone) {
//     return next(new AppError(401, "Phone number required!"));
//   }
//   const phoneRegex = /^[0-9]{10}$/;

//   if (!phoneRegex.test(phone)) {
//     return next(new AppError(401, "Provide a valid 10-digit phone number!"));
//   }
//   if (!email) {
//     return next(new AppError(401, "Provide Email!"));
//   }
//   if (!game) {
//     return next(new AppError(400, "Provide game!"));
//   }
//   if (!password) {
//     return next(new AppError(401, "Provide password!"));
//   }

//   const checkUserQuery = `SELECT COUNT(*) AS phone_exist FROM users WHERE phone = ?`;
//   const [userResult] = await db.query(checkUserQuery, [phone]);

//   if (userResult[0].phone_exist > 0) {
//     return next(new AppError(400, "User already exists!"));
//   }

//   const checkOTPQuery = `SELECT * FROM otps WHERE phone = ? AND otp = ?`;
//   const otpVlaue = [phone, givenOTP];
//   const [otpResult] = await db.query(checkOTPQuery, otpVlaue);

//   // console.log(otpVlaue,otpResult);
//   if (otpResult.length === 0) {
//     return next(new AppError(401, "Invalid OTP"));
//   }

//   const token = createSendToken(phone);

//   const insertUserQuery = `INSERT INTO users ( phone, game, email, password) VALUES (?, ?, ?, ?)`;

//   // console.log("hello world")
//   const hashedPassword = await bcrypt.hash(password, 10);
//   // console.log(hashedPassword, "ji");
//   const [userData] = await db.query(insertUserQuery, [
//     phone,
//     game,
//     email,
//     hashedPassword,
//   ]);
//   const userId = userData.insertId;
//   const createUserProgress = await db.query(
//     "INSERT INTO player_progress (user_id) VALUES (?)",
//     [userId]
//   );

//   return res
//     .status(200)
//     .json({ status: "Success", message: "Account created", userId, token });
// });

// exports.setUserName = catchAsync(async (req, res, next) => {
//   const { name } = req.body;
//   const userId = req.user.id;
//   if (!name || name === "") {
//     return next(new AppError(401, "Provide Your Name"));
//   }
//   if (!userId) {
//     return next(new AppError(400, "Technical error found!"));
//   }
//   const [userExist] = await db.query(`SELECT * FROM users WHERE id = ?`, [
//     userId,
//   ]);
//   if (userExist.length < 1) {
//     return next(new AppError(401, "User Not found!"));
//   }
//   const [setName] = await db.query(`UPDATE users SET name = ? WHERE id = ?`, [
//     name,
//     userId,
//   ]);
//   if (setName.affectedRows > 1) {
//     return next(new AppError(400, "Error while adding name"));
//   }
//   return res.status(200).json({
//     statsu: "Success",
//     message: "Name added",
//   });
// });



// exports.userLoginSendOTP = catchAsync(async (req, res, next) => {
//   const { phone, password } = req.body;

//   if (!phone) {
//     return next(new AppError(401, "Phone Number Required!"));
//   }
//   const phoneRegex = /^[0-9]{10}$/;

//   if (!phoneRegex.test(phone)) {
//     return next(new AppError(401, "Provide a valid 10-digit phone number!"));
//   }
//   if (!password) {
//     return next(new AppError(401, "Password Required!"));
//   }

//   const userCheckQuery = "SELECT * FROM users WHERE phone = ?";
//   const userCheckValue = [phone];
//   const [userCheck] = await db.query(userCheckQuery, userCheckValue);

//   if (userCheck.length === 0) {
//     return next(new AppError(403, "User not found!"));
//   }
//   const user = userCheck[0];

//   // Compare the provided password with the stored hashed password
//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     return next(new AppError(403, "Invalid password!"));
//   }
//   // const otpchecquery = "SELECT * FROM otps WHERE phone = ?";
//   // const otpcheckvalue = [phone];
//   // const [optexists] = await db.query(otpchecquery, otpcheckvalue);
//   const generateOTP = () => Math.floor(1000 + Math.random() * 9000);

//   // if (optexists.length > 0) {
//   const otp = generateOTP();
//   const [saveOTP] = await db.query(`UPDATE otps SET otp = ? WHERE phone = ?`, [
//     otp,
//     phone,
//   ]);
//   if (saveOTP.affectedRows < 0) {
//     return next(new AppError(401, "Error in sending OTP on your number!"));
//   }

//   return res.status(200).json({
//     status: "succuss",
//     message: `OTP has been sent to ${phone}`,
//     OTP: `${otp}`,
//   });
// });

// exports.userLoginVerifyOTP = catchAsync(async (req, res, next) => {
//   const { givenOTP, phone, password } = req.body;
//   if (!givenOTP) {
//     return next(new AppError(401, "Provide OTP!"));
//   }
//   if (!phone) {
//     return next(new AppError(401, "Phone number required!"));
//   }
//   const phoneRegex = /^[0-9]{10}$/;

//   if (!phoneRegex.test(phone)) {
//     return next(new AppError(401, "Provide a valid 10-digit phone number!"));
//   }

//   // const checkOTPverfy = await createVerificationCheck(givenOTP, phone);
//   // // console.log(checkOTPverfy);
//   // return res.status(200).json({
//   //   response: checkOTPverfy
//   // })
//   if (!password) {
//     return next(new AppError(401, "Provide password!"));
//   }

//   const userCheckQuery = "SELECT * FROM users WHERE phone = ?";
//   const userCheckValue = [phone];
//   const [userCheck] = await db.query(userCheckQuery, userCheckValue);

//   if (userCheck.length === 0) {
//     return next(new AppError(403, "User not found!"));
//   }
//   const user = userCheck[0];

//   // Compare the provided password with the stored hashed password
//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     return next(new AppError(403, "Invalid password!"));
//   }
//   const checkOTPQuery = `SELECT * FROM otps WHERE phone = ? AND otp = ?`;
//   const otpVlaue = [phone, givenOTP];
//   const [otpResult] = await db.query(checkOTPQuery, otpVlaue);

//   // console.log(otpVlaue,otpResult);
//   if (otpResult.length === 0) {
//     return next(new AppError(401, "Invalid OTP"));
//   }

//   const token = createSendToken(phone);

//   return res.status(200).json({ message: "Login Succuss!", token });
// });

// exports.userDashboard = catchAsync(async (req, res, next) => {
//   const { id, team_id } = req.user;
//   const [teamData] = await db.query(`
//     SELECT 
//       teams.name AS teamName, 
//       team_progress.score AS teamScore 
//     FROM teams
//     INNER JOIN team_progress ON teams.id = team_progress.team_id
//     WHERE teams.id = ?;
//   `, [team_id]);
//   const [playerData] = await db.query(`
//     SELECT 
//       users.id AS playerId, 
//       users.name AS playerName, 
//       users.leadership, 
//       player_progress.score AS playerScore
//     FROM users
//     INNER JOIN player_progress ON users.id = player_progress.user_id
//     WHERE users.team_id = ?;
//   `, [team_id]);
    

  
//   const dashboardData = {
//     team: {
//       teamName: teamData[0].teamName,
//       teamScore: teamData[0].teamScore,
//     },
//     players: playerData.map(player => ({
//       id: player.playerId,
//       playerName: player.playerName,
//       playerScore: player.playerScore,
//       leadership: player.leadership,
//     })),
//   };
  
  
  
//   if (dashboardData.length === 0) {
//     return next(new AppError(401, "Team not found!"));
//   }
//   // console.log(team);
//   res.status(200).json({status:"success", message: "dashboard data fetched successfully", dashboardData });
// });





// exports.getUserDetailsById = catchAsync(async(req, res, next)=>{
//   const user_id = req.params.user_id;
//   let teamData
//   const userQuery = "SELECT id,name,game,team_id FROM users WHERE id = ?";
//   const [userData] = await db.query(userQuery, [user_id]);
//   if(userData.length === 0){
//     return next(new AppError(404, "User not found!"));
//   }
//   if(userData[0].team_id !== null || userData[0].team_id > 0){
//     teamData = 'In Team'
//   }
//   else{
//     teamData = 'In Team'
//   }
//   const data = {
//     id: userData[0].id,
//     name: userData[0].name,
//     game: userData[0].game,
//     teamData: teamData,
//   }
//   res.status(200).json({status: "success", message: "User data fetched successfully", data });
// })


// exports.addUserScore = async(req, res, next) =>{
//   const { score , id} = req.body;
  
//   const userQuery = "UPDATE player_progress SET score = score + ? WHERE user_id = ?";
//   const [updateScore] = await db.query(userQuery, [score, id]);
//   if(updateScore.affectedRows === 0){
//     return next(new AppError(401, "User not found!"));
//   }
//   res.status(200).json({status: "success", message: "Score added successfully", score: score});
// }