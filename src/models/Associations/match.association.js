module.exports = (db) => {
    db.User.hasMany(db.Match, { foreignKey: "mod_id", as: "matches" });
    db.Match.belongsTo(db.User, { foreignKey: "mod_id", as: "moderator" });
};