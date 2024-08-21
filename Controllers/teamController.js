const db = require("../Config/database");
const { asyncChoke } = require("../Utils/asyncWrapper");
const AppError = require("../Utils/error");



exports.teamFetch = asyncChoke(async(req, res, next)=>{
    const user_id = req.user.id;
    const teamFoundQuery = "SELECT * FROM playerDetails where user_id = ?"
    const teamFoundValue = [user_id];
    const [teamFound] = await db.query(teamFoundQuery,teamFoundValue);
    if(teamFound.length === 0){
        return next(new AppError(404, "Team not found!"));
    }
    const team_id = teamFound[0].team_id;
    

    console.log(teamFound)

    const teamQuery = "SELECT * FROM teams WHERE id = ?"
    const teamValues = [team_id]
    const [team] = await db.query(teamQuery, teamValues);
    if(team.length === 0){
        return next(new AppError(404, "Team not found!"));
    }
    const teamName = team[0].name
    const team_points = team[0].team_points;
    const teamPlayersQuery = "SELECT * FROM playerDetails WHERE team_id = ?"
    const teamPlayersValue = [team_id]
    const [teamPlayers] = await db.query(teamPlayersQuery, teamPlayersValue);
    
    const userIds = teamPlayers.map(player => player.user_id);
    

    // Query to get the names of all team members from the users table
    const usersQuery = "SELECT id, name FROM users WHERE id IN (?)";
    const [users] = await db.query(usersQuery, [userIds]);
    
    const result = teamPlayers.map(player => {
        const user = users.find(u => u.id === player.user_id);
        return {
            name: user ? user.name : null,
            leadership: player.leadership,
            points:player.points
        };
    });
    res.status(200).json({
        status:"succuss",
        team_id:team_id,
        teamName:teamName,
        teamPoints: team_points,
        players:result
    });

})