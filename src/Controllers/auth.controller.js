const { User, UserProfile, UserProgress } = require("../models");
const AppError = require("../utils/error");
const jwt = require("jsonwebtoken");
const { catchAsync } = require("../Utils/catchAsync");
const { createSendToken } = require("../Utils/helpers");
const {
  isValidPhoneNumber,
  isValidPhoneCountryCode,
} = require("../Utils/helpers");

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
 
  if (!token) {
    return next(
      new AppError(401, "You are not logged in! Please log in to get access.")
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(
        new AppError(401, "Your session has expired. Please log in again.")
      );
    }
    return next(new AppError(401, "Invalid token. Please log in again."));
  }

  const currentUser = await User.findOne({
    where: { id: decoded.id, phone_number: decoded.phone_number },
  });
  if (!currentUser) {
    return next(
      new AppError(
        401,
        "The user belonging to this token does no longer exist."
      )
    );
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.type)) {
      return next(
        new AppError(403, "You do not have permission to perform this action.")
      );
    }
    next();
  };
};

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.query;
  const user = await User.findOne({ where: { verification_token: token } });

  if (!user) {
    return next(new AppError(400, "Invalid or expired token"));
  }

  user.is_verified = true;
  user.verification_token = null;
  await user.save();

  res.status(200).json({ message: "Email verified successfully" });
});

exports.adminLogin = catchAsync(async (req, res, next) => {
  const { phone_number, country_code, loginType } = req.body;

  if (!phone_number || !country_code) {
    return next(
      new AppError(400, "Please provide phone number and country code!")
    );
  }

  if (
    !isValidPhoneNumber(phone_number) ||
    !isValidPhoneCountryCode(country_code)
  ) {
    return next(
      new AppError(400, "Please provide valid country code and phone number")
    );
  }

  const user = await User.findOne({
    where: { phone_number, country_code, type: loginType || "admin" },
  });

  if (!user) {
    return next(new AppError(404, `${loginType} not found!`));
  }

  createSendToken(user, res);
  res.status(200).json({ status: "success", message: "Login successful!" });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { phone_number, country_code } = req.body;
  try {
    if (
      !isValidPhoneNumber(phone_number) ||
      !isValidPhoneCountryCode(country_code)
    ) {
      return next(
        new AppError(400, "Please provide valid country code and phone number")
      );
    }
    let user = await User.findOne({ where: { phone_number, country_code } });
    if (!user) {
      return next(new AppError(404, "User not found!"));
    }

    return res.status(200).json({
      status: "success",
      message: `OTP sent to ${country_code} ${phone_number}`,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(400, error.message));
  }
});

exports.signUpUser = catchAsync(async (req, res, next) => {
  const { phone_number, country_code, email, game, name } = req.body;
  try {
    if (!name || !phone_number || !country_code || !email || !game) {
      return next(new AppError(400, "Please provide all required fields!"));
    }
    if (
      !isValidPhoneNumber(phone_number) ||
      !isValidPhoneCountryCode(country_code)
    ) {
      return next(
        new AppError(400, "Please provide valid country code and phone number")
      );
    }
    let user = await User.findOne({ where: { phone_number, country_code } });
    if (user) {
      return next(new AppError(400, "User already exists!"));
    }
    user = await User.create({
      name,
      phone_number,
      country_code,
      email,
      game,
      is_verified: false,
    });

    res.status(201).json({
      message: "User and profile created successfully",
      user
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(400, error.message));
  }
});

exports.otpVerifier = catchAsync(async (req, res, next) => {
  const { country_code, phone_number, otp } = req.body;

  try {
    if (!otp || otp.length !== 5) {
      return next(new AppError(400, "Please provide a valid 5 digit OTP!"));
    }

    if (
      !isValidPhoneNumber(phone_number) ||
      !isValidPhoneCountryCode(country_code)
    ) {
      return next(
        new AppError(400, "Please provide valid country code and phone number")
      );
    }

    const user = await User.findOne({ where: { phone_number, country_code } });

    if (!user) {
      return next(new AppError(404, "User not found!"));
    }

    if (user.is_verified) {
      createSendToken(user, res);
      return res
        .status(200)
        .json({ status: "success", message: "Login Successfull!" });
    }

    user.is_verified = true;
    await user.save();

    await UserProgress.create({ 
      user_id: user.id 
    });
    await UserProfile.create({
      user_id: user.id,
    });

    createSendToken(user, res);
    res.status(200).json({ status: "success", message: "Account Created!" });
  } catch (error) {
    console.log(error);
    return next(new AppError(400, error.message));
  }
});
