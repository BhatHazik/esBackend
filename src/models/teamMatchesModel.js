module.exports = (sequelize, DataTypes) => {
    const TeamMatches = sequelize.define('TeamMatches', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        match_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Matches',
                key: 'id'
            }
        },
        team_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Teams',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending'
        }
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return TeamMatches;
};