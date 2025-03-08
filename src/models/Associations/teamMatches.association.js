module.exports = (db) => {
    db.Match.hasMany(db.TeamMatches, { foreignKey: "match_id", as: "teamMatches" });
    db.TeamMatches.belongsTo(db.Match, { foreignKey: "match_id", as: "match" });

    db.Team.hasMany(db.TeamMatches, { foreignKey: "team_id", as: "teamMatches" });
    db.TeamMatches.belongsTo(db.Team, { foreignKey: "team_id", as: "team" });
};