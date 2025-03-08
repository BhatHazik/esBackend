module.exports = (db) => {
    db.Team.hasMany(db.User, {
      foreignKey: 'team_id',
      as: 'members'
    });
  };