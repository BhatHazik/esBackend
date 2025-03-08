const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql',
    logging: false
});


const db = {};
const associations = require("./Associations/index");

db.User = require("./userModel")(sequelize, DataTypes);
db.Team = require("./teamModel")(sequelize, DataTypes);
db.UserProfile = require("./userProfileModel")(sequelize, DataTypes);
db.TeamProfile = require("./teamProfileModel")(sequelize, DataTypes);
db.UserProgress = require("./userProgressModel")(sequelize, DataTypes);
db.TeamProgress = require("./teamProgressModel")(sequelize, DataTypes);
db.Match = require("./matchModel")(sequelize, DataTypes);
db.TeamMatches = require("./teamMatchesModel")(sequelize, DataTypes);

associations(db);

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("DB Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = db;