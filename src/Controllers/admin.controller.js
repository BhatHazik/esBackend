const { User, UserProfile } = require("../models");
const AppError = require("../utils/error");
const { catchAsync } = require("../Utils/catchAsync");
const {
  isValidPhoneCountryCode,
  isValidPhoneNumber,
} = require("../Utils/helpers");

exports.createModerator = catchAsync(async (req, res, next) => {
  const { name, email, country_code, phone_number, game, modType } = req.body;
  try {
    if (
      !name ||
      !email ||
      !country_code ||
      !phone_number ||
      !game ||
      !modType
    ) {
      return next(new AppError(400, "Please provide all the required fields!"));
    }
    if (
      !isValidPhoneNumber(phone_number) ||
      !isValidPhoneCountryCode(country_code)
    ) {
      return next(
        new AppError(400, "Please provide valid country code and phone number")
      );
    }
    if (modType !== "moderator" && modType !== "mod-manager") {
      return next(new AppError(400, "Invalid Mod type!"));
    }
    let userWithEmail = await User.findOne({ where: { email: email } });
    if (userWithEmail) {
      return next(new AppError(400, "User with email already exists!"));
    }
    let userWithPhone = await User.findOne({
      where: { country_code, phone_number },
    });
    if (userWithPhone) {
      return next(new AppError(400, "User with phone already exists!"));
    }
    userWithPhone = await User.create({
      name,
      email,
      country_code,
      phone_number,
      game,
      is_verified: true,
      type: modType,
    });
    await UserProfile.create({ user_id: userWithPhone.id });
    res
      .status(201)
      .json({ message: "Moderator created successfully", userWithPhone });
  } catch (error) {
    console.log(error);
    return next(new AppError(400, error.message));
  }
});
