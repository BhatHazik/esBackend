const {
  User,
  UserProgress,
  Team,
  TeamProgress,
  UserProfile,
  Match,
  TeamMatches,
} = require("../models");
const AppError = require("../utils/error");
const { catchAsync } = require("../Utils/catchAsync");
const moment = require('moment');


exports.getUserDashboard = catchAsync(async (req, res, next) => {
  const { id: user_id, team_id } = req.user;

  try {
    if (!team_id || team_id === undefined || team_id === null) {
      return next(new AppError(400, "You are not in a team!"));
    }

    const userProgress = await UserProgress.findOne({ where: { user_id } });
    const userScore = userProgress ? userProgress.score : 0;

    const teamProgress = await TeamProgress.findOne({ where: { team_id } });
    const teamScore = teamProgress ? teamProgress.score : 0;

    const teamMembers = await User.findAll({
      where: { team_id },
      include: [
        { model: UserProgress, as: "userProgresses" },
        { model: UserProfile, as: "user_profile" },
      ],
    });

    const teamMates = teamMembers.map((member) => ({
      id: member.id,
      name: member.user_profile ? member.user_profile.name : "Unknown",
      score:
        member.userProgresses.length > 0 ? member.userProgresses[0].score : 0,
      leadership: member.leadership,
    }));

    res.status(200).json({
      status: "success",
      data: {
        userScore,
        teamScore,
        teamMates,
      },
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(400, error.message));
  }
});


exports.getAvailableMatches = catchAsync(async (req, res, next) => {
    const { date } = req.query;

    try {
        if (!date) {
            return next(new AppError(400, "Please provide a date"));
        }

        const isoDate = moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD');

        const matches = await Match.findAll({
            where: { date: isoDate },
            include: [
                {
                    model: TeamMatches,
                    as: 'teamMatches',
                    include: [{ model: Team, as: 'team' }]
                }
            ]
        });

        if (!matches || matches.length === 0) {
            return next(new AppError(404, 'No matches found for the given date'));
        }

        const matchDetails = matches.map(match => {
            const joinedTeamsCount = match.teamMatches.length;
            const maxTeams = match.teams.length;

            return {
                id: match.id,
                name: match.name,
                game: match.game,
                map: match.map,
                date: match.date,
                time: match.time,
                mod_id: match.mod_id,
                joinedTeamsCount,
                maxTeams,
                teams: match.teams,
                joinedTeams: match.teamMatches.map(tm => ({
                    team_id: tm.team_id,
                    team_name: tm.team.name,
                    status: tm.status
                }))
            };
        });

        res.status(200).json({
            status: "success",
            data: matchDetails
        });
    } catch (error) {
        console.log(error);
        return next(new AppError(400, error.message));
    }
});



exports.joinMatch = catchAsync(async (req, res, next) => {
    const { id: user_id, team_id } = req.user;
    const { match_id } = req.body;

    try {
        if (!match_id) {
            return next(new AppError(400, "Please provide match ID"));
        }
        const user = await User.findByPk(user_id);
        if (!user || !user.leadership) {
            return next(new AppError(403, "You must be a team leader to join a match"));
        }

        const match = await Match.findByPk(match_id, {
            include: [{ model: TeamMatches, as: 'teamMatches' }]
        });

        if (!match) {
            return next(new AppError(404, "Match not found"));
        }

        if (match.status === 'active' || match.status === 'over') {
            return next(new AppError(400, `This Match is already ${match.status}!`));
        }
        const joinedTeamsCount = match.teamMatches.length;
        const maxTeams = match.teams;

        if (joinedTeamsCount >= maxTeams) {
            return next(new AppError(400, "The match is already filled"));
        }

        const existingTeamMatch = await TeamMatches.findOne({ where: { match_id, team_id } });
        if (existingTeamMatch) {
            return next(new AppError(400, "Your team is already in this match"));
        }
        const teamMatch = await TeamMatches.create({
            match_id,
            team_id,
            status: 'joined'
        });

        res.status(200).json({
            status: "success",
            data: teamMatch
        });
    } catch (error) {
        console.log(error);
        return next(new AppError(400, error.message));
    }
});