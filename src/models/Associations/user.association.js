module.exports = (db) => {
  db.User.belongsTo(db.Team, {
    foreignKey: "team_id",
    as: "team",
  });

};
