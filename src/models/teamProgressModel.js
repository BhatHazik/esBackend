module.exports = (sequelize, DataTypes) => {
    const TeamProgress = sequelize.define('TeamProgress', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        score: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        team_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return TeamProgress;
};