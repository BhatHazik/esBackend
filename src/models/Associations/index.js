const userAssociations = require("./user.association");
const teamAssociations = require("./team.association");
const userProfileAssociation = require("./userProfile.association");
const teamProfileAssociation = require("./teamProfile.association");
const userProgressAssociation = require("./userProgress.association");
const teamProgressAssociation = require("./teamProgress.association");
const matchesAssociation = require("./match.association");
const teamMatchesAssociation = require("./teamMatches.association");


module.exports = (db) => {
  userAssociations(db);
  teamAssociations(db);
  userProfileAssociation(db);
  teamProfileAssociation(db);
  userProgressAssociation(db);
  teamProgressAssociation(db);
  matchesAssociation(db);
  teamMatchesAssociation(db);
};
