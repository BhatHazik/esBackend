module.exports = (db) => {
    db.Team.hasOne(db.TeamProfile, { foreignKey: "team_id" });
    db.TeamProfile.belongsTo(db.Team, { foreignKey: "team_id" });
  };