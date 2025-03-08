const { User, UserProfile, Match } = require("../models");
const AppError = require("../utils/error");
const { catchAsync } = require("../Utils/catchAsync");

exports.acceptMatch = catchAsync(async (req, res, next) => {
  const { id: user_id } = req.user;
  const { match_id } = req.body;
  try {
    if (!match_id) {
      return next(new AppError(400, "Please provide match id!"));
    }
    let match = await Match.findOne({ where: { id: match_id } });
    if (!match) {
      return next(new AppError(404, "Match not found!"));
    }
    if (match.mod_id !== user_id) {
      return next(
        new AppError(400, "You are not authorized to accept this match!")
      );
    }
    if (match.status === "accepted") {
      return next(new AppError(400, "Match already accepted!"));
    }
    match = await Match.update(
      { status: "accepted" },
      { where: { id: match_id } }
    );
    res.status(200).json({ message: "Match accepted successfully" });
  } catch (error) {
    console.log(error);
    return next(new AppError(400, error.message));
  }
});

exports.getAssignedMatches = catchAsync(async (req, res, next) => {
  const { id: user_id } = req.user;
  const { status } = req.query;
  try {
    if (!status) {
      return next(new AppError(400, "Please provide match status!"));
    }
    let matches = await Match.findAll({
      where: { mod_id: user_id, status: status },
    });
    res.status(200).json({ status: "success", data: matches });
  } catch (error) {
    console.log(error);
    return next(new AppError(400, error.message));
  }
});
