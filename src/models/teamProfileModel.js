module.exports = (sequelize, DataTypes) => {
    const TeamProfile = sequelize.define('TeamProfile', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        tag: {
            type: DataTypes.STRING,
            allowNull: true
        },
        profile: {
            type: DataTypes.STRING,
            allowNull: true
        },
        banner: {
            type: DataTypes.STRING,
            allowNull: true
        },
        wins: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        kills: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        matches: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        global: {
            type: DataTypes.STRING,
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
        team_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return TeamProfile;
};