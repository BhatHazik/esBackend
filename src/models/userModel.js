module.exports = (sequelize, DataTypes) => {
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    game: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.TEXT,
        defaultValue: 'user',
        allowNull: false
    },
    team_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    leadership: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
return User;
};