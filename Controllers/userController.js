const db = require("../Config/database");
const { asyncChoke } = require("../Utils/asyncWrapper");
const AppError = require("../Utils/error");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const createSendToken = (phone_no) => {
  // console.log(process.env.JWT_EXPIRY,process.env.JWT_SECRET)
  const tokenOptions = { expiresIn: process.env.JWT_EXPIRY };
  const token = jwt.sign(
    { data: phone_no },
    process.env.JWT_SECRET,
    tokenOptions
  );

  return token;
};

exports.userOTPsender = asyncChoke(async (req, res, next) => {
  const { phone_no, email, game, password } = req.body;
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (!phone_no) {
    return next(new AppError(401, "Phone Number Required!"));
  }
  const phoneRegex = /^[0-9]{10}$/;

  if (!phoneRegex.test(phone_no)) {
    return next(new AppError(401, "Provide a valid 10-digit phone number!"));
  }
  if (!email) {
    return next(new AppError(401, "Please provide your email address!"));
  }
  if (!validateEmail(email)) {
    return next(new AppError(401, "Invalid email format"));
  }
  if (!game) {
    return next(new AppError(401, "select an game!"));
  }
  if (!password) {
    return next(new AppError(401, "Password Required!"));
  }
  if (password.length < 8) {
    return next(
      new AppError(401, "Password must be at least 8 characters long!")
    );
  }

  const userCheckQuery = "SELECT * FROM users WHERE phone_no = ?";
  const userCheckValue = [phone_no];
  const [userCheck] = await db.query(userCheckQuery, userCheckValue);

  if (userCheck.length > 0) {
    return next(new AppError(403, "User already exists!"));
  }
  const otpchecquery = "SELECT * FROM otps WHERE phone_no = ?";
  const otpcheckvalue = [phone_no];
  const [optexists] = await db.query(otpchecquery, otpcheckvalue);
  const generateOTP = () => Math.floor(1000 + Math.random() * 9000);
  if (optexists.length > 0) {
    const otp = generateOTP();
    const [saveOTP] = await db.query(
      `UPDATE otps SET otp = ? WHERE phone_no = ?`,
      [otp, phone_no]
    );
    if (saveOTP.affectedRows < 0) {
      return next(new AppError(401, "Error in sending OTP on your number!"));
    }

    return res.status(200).json({
      status: "succuss",
      message: `OTP has been sent to ${phone_no}`,
      OTP: `${otp}`,
    });
  }

  const otp = generateOTP();
  const [saveOTP] = await db.query(
    `INSERT INTO otps (otp, phone_no) VALUES (?,?)`,
    [otp, phone_no]
  );
  if (saveOTP.affectedRows < 0) {
    return next(new AppError(401, "Error in sending OTP on your number!"));
  }

  return res.status(200).json({
    status: "succuss",
    message: `OTP has been sent to ${phone_no}`,
    OTP: `${otp}`,
  });
  // const userRegisterQuery = "INSERT INTO users (phone_no, email, game, password) VALUES(?,?,?,?)"
  // const userRegisterValue = [phone_no , email , game , password];
  // const [userRegister] = await db.query(userRegisterQuery,userRegisterValue);

  // if(userRegister.affectedRows < 1){
  //   return next(new AppError(400, "Unable to register this user!"));
  // }
});

exports.verifyRegisterOTP = asyncChoke(async (req, res, next) => {
  const { givenOTP, phone_no, email, game, password } = req.body;
  // const {  } = req.params;
  if (!givenOTP) {
    return next(new AppError(401, "Provide OTP!"));
  }
  if (!phone_no) {
    return next(new AppError(401, "Phone number required!"));
  }
  const phoneRegex = /^[0-9]{10}$/;

  if (!phoneRegex.test(phone_no)) {
    return next(new AppError(401, "Provide a valid 10-digit phone number!"));
  }
  if (!email) {
    return next(new AppError(401, "Provide Email!"));
  }
  if (!game) {
    return next(new AppError(400, "Provide game!"));
  }
  if (!password) {
    return next(new AppError(401, "Provide password!"));
  }

  const checkUserQuery = `SELECT COUNT(*) AS phone_exist FROM users WHERE phone_no = ?`;
  const [userResult] = await db.query(checkUserQuery, [phone_no]);

  if (userResult[0].phone_exist > 0) {
    return next(new AppError(400, "User already exists!"));
  }

  const checkOTPQuery = `SELECT * FROM otps WHERE phone_no = ? AND otp = ?`;
  const otpVlaue = [phone_no, givenOTP];
  const [otpResult] = await db.query(checkOTPQuery, otpVlaue);

  // console.log(otpVlaue,otpResult);
  if (otpResult.length === 0) {
    return next(new AppError(401, "Invalid OTP"));
  }

  const token = createSendToken(phone_no);

  const insertUserQuery = `INSERT INTO users ( phone_no, game, email, password) VALUES (?, ?, ?, ?)`;
  // console.log("hello world")
  const hashedPassword = await bcrypt.hash(password, 10);
  // console.log(hashedPassword, "ji");
  await db.query(insertUserQuery, [phone_no, game, email, hashedPassword]);

  return res.status(200).json({ message: "Account created", token });
});

exports.userLoginSendOTP = asyncChoke(async (req, res, next) => {
  const { phone_no, password } = req.body;

  if (!phone_no) {
    return next(new AppError(401, "Phone Number Required!"));
  }
  const phoneRegex = /^[0-9]{10}$/;

  if (!phoneRegex.test(phone_no)) {
    return next(new AppError(401, "Provide a valid 10-digit phone number!"));
  }
  if (!password) {
    return next(new AppError(401, "Password Required!"));
  }

  const userCheckQuery = "SELECT * FROM users WHERE phone_no = ?";
  const userCheckValue = [phone_no];
  const [userCheck] = await db.query(userCheckQuery, userCheckValue);

  if (userCheck.length === 0) {
    return next(new AppError(403, "User not found!"));
  }
  const user = userCheck[0];

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new AppError(403, "Invalid password!"));
  }
  // const otpchecquery = "SELECT * FROM otps WHERE phone_no = ?";
  // const otpcheckvalue = [phone_no];
  // const [optexists] = await db.query(otpchecquery, otpcheckvalue);
  const generateOTP = () => Math.floor(1000 + Math.random() * 9000);

  // if (optexists.length > 0) {
  const otp = generateOTP();
  const [saveOTP] = await db.query(
    `UPDATE otps SET otp = ? WHERE phone_no = ?`,
    [otp, phone_no]
  );
  if (saveOTP.affectedRows < 0) {
    return next(new AppError(401, "Error in sending OTP on your number!"));
  }

  return res.status(200).json({
    status: "succuss",
    message: `OTP has been sent to ${phone_no}`,
    OTP: `${otp}`,
  });
});

exports.userLoginVerifyOTP = asyncChoke(async (req, res, next) => {
  const { givenOTP, phone_no, password } = req.body;
  if (!givenOTP) {
    return next(new AppError(401, "Provide OTP!"));
  }
  if (!phone_no) {
    return next(new AppError(401, "Phone number required!"));
  }
  const phoneRegex = /^[0-9]{10}$/;

  if (!phoneRegex.test(phone_no)) {
    return next(new AppError(401, "Provide a valid 10-digit phone number!"));
  }
  if (!password) {
    return next(new AppError(401, "Provide password!"));
  }

  const userCheckQuery = "SELECT * FROM users WHERE phone_no = ?";
  const userCheckValue = [phone_no];
  const [userCheck] = await db.query(userCheckQuery, userCheckValue);

  if (userCheck.length === 0) {
    return next(new AppError(403, "User not found!"));
  }
  const user = userCheck[0];

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new AppError(403, "Invalid password!"));
  }
  const checkOTPQuery = `SELECT * FROM otps WHERE phone_no = ? AND otp = ?`;
  const otpVlaue = [phone_no, givenOTP];
  const [otpResult] = await db.query(checkOTPQuery, otpVlaue);

  // console.log(otpVlaue,otpResult);
  if (otpResult.length === 0) {
    return next(new AppError(401, "Invalid OTP"));
  }

  const token = createSendToken(phone_no);

  return res.status(200).json({ message: "Login Succuss!", token });
});

// const db = require("../Config/database");
// const jwt = require("jsonwebtoken");
// const { asyncChoke } = require("../Utils/asyncWrapper");
// const AppError = require("../Utils/error");
// const { Vonage } = require("@vonage/server-sdk");

// const createSendToken = (res, req, phone_no) => {
//   const tokenOptions = { expiresIn: process.env.JWT_EXPIRY };
//   const token = jwt.sign(
//     { data: phone_no },
//     process.env.JWT_SECRET,
//     tokenOptions
//   );
//   return token;
// };

// const vonage = new Vonage({
//   apiKey: process.env.VONAGE_API_KEY,
//   apiSecret: process.env.VONAGE_API_SECRET,
// });

// exports.createUserOTP = asyncChoke(async (req, res, next) => {
//   const generateOTP = () => Math.floor(1000 + Math.random() * 9000);
//   const otp = generateOTP();
//   const { name, phone_no, email, username } = req.body;
//   const from = "Vonage APIs";
//   const to = `91${phone_no}`;
//   const text = `Hello ${name} welcome in your app PUSG your OTP is ${otp}. Don't share this OTP with anyone! Thanks for using PUSG`;
//   if (name == "" && phone_no == "" && email == "" && username == "") {
//     return next(new AppError(401, "Fill All Fields!"));
//   }
//   const [checkExist] = await db.query(
//     `SELECT * FROM users WHERE username = ? AND phone_no = ?`,
//     [username, phone_no]
//   );
//   if (checkExist.length[0] > 0) {
//     return next(new AppError(409, "user already exists!"));
//   }
//   const [checkOtpExists] = await db.query(
//     `SELECT * FROM otps WHERE phone_no = ?`,
//     [phone_no]
//   );
//   if (checkOtpExists.length > 0) {
//     const [UpdateOtp] = await db.query(
//       `UPDATE otps SET otp = ? WHERE phone_no = ?`,
//       [otp, phone_no]
//     );
//     if (UpdateOtp.affectedRows < 0) {
//       return next(new AppError(401, "Error in sending OTP on your number!"));
//     }
//   } else {
//     const [saveOTP] = await db.query(
//       `INSERT INTO otps (otp, phone_no) VALUES (?,?)`,
//       [otp, phone_no]
//     );
//     if (saveOTP.affectedRows < 0) {
//       return next(new AppError(401, "Error in sending OTP on your number!"));
//     }
//   }
//   async function sendSMS() {
//     await vonage.sms
//       .send({ to, from, text })
//       .then((resp) => {
//         res.status(200).json({
//           message: "OTP sent successfully",
//           name,
//           phone_no,
//           email,
//           username,
//         });
//       })
//       .catch((err) => {
//         console.log("There was an error sending the messages.");
//         console.error(err);
//       });
//   }
//   sendSMS();
// });

// exports.LoginUserOTP = asyncChoke(async (req, res, next) => {
//   const { phone_no } = req.body;
//   const generateOTP = () => Math.floor(1000 + Math.random() * 9000);
//   const otp = generateOTP();
//   const from = "Vonage APIs";
//   const to = `91${phone_no}`;
//   const text = `Dear user your OTP is ${otp}`;
//   if (phone_no !== "") {
//     const [checkExist] = await db.query(
//       `SELECT * FROM users WHERE phone_no = ?`,
//       [phone_no]
//     );
//     if (checkExist.length > 0) {
//       const [checkOtpExists] = await db.query(
//         `SELECT * FROM otps WHERE phone_no = ?`,
//         [phone_no]
//       );
//       if (checkOtpExists.length > 0) {
//         const [UpdateOtp] = await db.query(
//           `UPDATE otps SET otp = ? WHERE phone_no = ?`,
//           [otp, phone_no]
//         );
//         if (UpdateOtp.affectedRows < 0) {
//           return next(
//             new AppError(401, "Error in sending OTP on your number!")
//           );
//         }
//       } else {
//         const [saveOTP] = await db.query(
//           `INSERT INTO otps (otp, phone_no) VALUES (?,?)`,
//           [otp, phone_no]
//         );
//         if (saveOTP.affectedRows < 0) {
//           return next(
//             new AppError(401, "Error in sending OTP on your number!")
//           );
//         }
//       }
//       async function sendSMS() {
//         await vonage.sms
//           .send({ to, from, text })
//           .then((resp) => {
//             res.status(200).json({
//               message: "OTP sent successfully",
//               phone_no
//             });
//           })
//           .catch((err) => {
//             console.log("There was an error sending the messages.");
//             console.error(err);
//           });
//       }
//       sendSMS();
//     }
//     else{
//         return next(new AppError(401, 'User does not exists!'));
//     }
//   }else{
//     return next(new AppError(401, 'Fill All Fields!'));
//   }
// });

// exports.verifyOTP = asyncChoke(async (req, res, next) => {
//   const { givenOTP } = req.body;
//   const { name, email, username, phone_no } = req.params;

//   if (
//     givenOTP !== "" &&
//     phone_no !== "" &&
//     email !== "" &&
//     name !== "" &&
//     username !== ""
//   ) {

//     const checkUserQuery = `SELECT COUNT(*) AS phone_exist FROM users WHERE phone_no = ?`;
//     const [userResult] = await db.query(checkUserQuery, [phone_no]);

//     if (userResult[0].phone_exist > 0) {
//       // return next(new AppError(409, 'user already exists'));
//       const checkOTPQuery = `SELECT COUNT(*) AS otp_matched FROM otps WHERE phone_no = ? AND otp = ?`;
//       const [otpResult] = await db.query(checkOTPQuery, [phone_no, givenOTP]);

//       if (otpResult[0].otp_matched === 0) {
//         return next(new AppError(401, "Invalid OTP"));
//       }
//       const token = createSendToken(res, req, phone_no);
//       return res.status(200).json({ message: "Logged in successfully" , token});
//     }
//     const [usernameCheck] = await db.query(
//         `SELECT * FROM users WHERE username = ?`,
//         [username]
//       );
//       if (usernameCheck.length > 0) {
//         return next(new AppError(401, "Username already taken! try other"));
//       }
//     const checkOTPQuery = `SELECT COUNT(*) AS otp_matched FROM otps WHERE phone_no = ? AND otp = ?`;
//     const [otpResult] = await db.query(checkOTPQuery, [phone_no, givenOTP]);

//     if (otpResult[0].otp_matched === 0) {
//       return next(new AppError(401, "Invalid OTP"));
//     }
//     const token = createSendToken(res, req, phone_no);
//     const insertUserQuery = `INSERT INTO users (name, email, phone_no, username) VALUES (?, ?, ?, ?)`;
//     await db.query(insertUserQuery, [name, email, phone_no, username]);

//     return res.status(200).json({ message: "Account created", token });
//   } else {
//     return next(new AppError(400, "Fill all fields"));
//   }
// });
