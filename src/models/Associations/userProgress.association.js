module.exports = (db) => {
    db.User.hasMany(db.UserProgress, { foreignKey: "user_id", as: "userProgresses" });
    db.UserProgress.belongsTo(db.User, { foreignKey: "user_id", as: "user" });
};