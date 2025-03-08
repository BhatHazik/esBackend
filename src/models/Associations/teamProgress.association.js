module.exports = (db) => {
    db.Team.hasMany(db.TeamProgress, { foreignKey: "team_id" });
    db.TeamProgress.belongsTo(db.Team, { foreignKey: "team_id" });
  };