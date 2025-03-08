
module.exports = (sequelize, DataTypes) => {
const UserProfile = sequelize.define('user_profile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tag: {
        type: DataTypes.STRING,
        allowNull: true
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    top_skill: {
        type: DataTypes.STRING,
        allowNull: true
    },
    wins: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    kills: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    global: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    youtube: {
        type: DataTypes.STRING,
        allowNull: true
    },
    instagram: {
        type: DataTypes.STRING,
        allowNull: true
    },
    twitter: {
        type: DataTypes.STRING,
        allowNull: true
    },
    profile: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    in_game_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});
return UserProfile;
}