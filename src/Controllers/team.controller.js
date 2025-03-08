const { User, Team, TeamProgress, TeamProfile } = require("../models");
const AppError = require("../utils/error");
const { catchAsync } = require("../Utils/catchAsync");

exports.createTeam = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const user_id = req.user.id;
  try {
    if (!name) {
      return next(new AppError(400, "Please provide the team name!"));
    }
    let team = await Team.findOne({ where: { name } });
    if (team) {
      return next(new AppError(400, "Team already exists!"));
    }
    const userTeamCheck = await User.findOne({
      where: { team_id: null, id: user_id },
    });

    if (!userTeamCheck) {
      return next(new AppError(400, "You are already in a team!"));
    }

    team = await Team.create({
      name,
    });

    await User.update(
      { team_id: team.id, leadership: 1 },
      { where: { id: user_id } }
    );
    await TeamProgress.create({ team_id: team.id });
    await TeamProfile.create({ team_id: team.id });

    res.status(201).json({ message: "Team created successfully", team });
  } catch (error) {
    console.log(error);
    return next(new AppError(400, error.message));
  }
});

exports.addUserToTeam = catchAsync(async (req, res, next) => {
  const { user_id } = req.body;
  const { id, team_id, leadership } = req.user;
  console.log(id, user_id);
  try {
    const teamSize = await User.findAll({where: {team_id}});
    if (teamSize.length >= 4) {
      return next(new AppError(400, "Team is full!"));
    }
    if (!user_id) {
      return next(new AppError(400, "Please provide the user ID!"));
    }
    if (id === user_id) {
      return next(new AppError(400, "You cannot add yourself to the team!"));
    }
    if (!leadership) {
      return next(new AppError(400, "You are not a leader!"));
    }
    const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
      return next(new AppError(400, "User not found!"));
    }
    const team = await Team.findByPk(team_id);
    if (!team) {
      return next(new AppError(400, "Team not found!"));
    }
    if (user.team_id) {
      return next(new AppError(400, "User is already in a team!"));
    }
    await User.update({ team_id }, { where: { id: user_id } });
    res.status(200).json({ message: "User added to team successfully" });
  } catch (error) {
    console.log(error);
    return next(new AppError(400, error.message));
  }
});

exports.removeUserFromTeam = catchAsync(async (req, res, next) => {
  const { user_id } = req.body;
  const { id, team_id, leadership } = req.user;
  try {
    if (!user_id) {
      return next(new AppError(400, "Please provide the user ID!"));
    }
    if (id === user_id) {
      return next(new AppError(400, "You cannot kick yourself from the team!"));
    }
    if (!leadership) {
      return next(new AppError(400, "You are not a leader!"));
    }
    const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
      return next(new AppError(400, "User not found!"));
    }
    if (!user.team_id || user.team_id !== team_id) {
      return next(new AppError(400, "User is not in your team!"));
    }
    await User.update({ team_id: null }, { where: { id: user_id } });
    res.status(200).json({ message: "User kicked from team successfully" });
  } catch (error) {
    console.log(error);
    return next(new AppError(400, error.message));
  }
});
