module.exports = (db) => {
  db.User.hasOne(db.UserProfile, { foreignKey: "user_id", as: "user_profile" });
  db.UserProfile.belongsTo(db.User, { foreignKey: "user_id", as: "user" });
};