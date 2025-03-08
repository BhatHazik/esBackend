const { User, UserProfile, Match } = require("../models");
const AppError = require("../utils/error");
const { catchAsync } = require("../Utils/catchAsync");



exports.assignMatches = catchAsync(async (req, res, next) => {
    const {name, game, map, teams, date, time , mod_id} = req.body;

    try {
        if (!name || !game || !map || !teams || !date || !time || !mod_id) {
            return next(new AppError(400, "Please provide all required fields!"));
        }
        let match = await Match.findOne({ where: { name, game, map, teams, date, time , mod_id} });
        if (!match) {
            match = await Match.create({ name, game, map, teams, date, time, mod_id });
        }
        res.status(201).json({
            status: "success",
            data: match,
        });
    } catch (error) {
        console.log(error);
        return next(new AppError(400, error.message));
    }
});