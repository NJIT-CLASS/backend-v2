module.exports = function (sequelize, DataTypes) {
    var UserLogin = sequelize.define('UserLogin', {
        UserID: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'UserID',
            allowNull: false,
            primaryKey: true,
        },
        Email: {
            // official email of user
            type: DataTypes.STRING(70),
            field: 'Email',
            allowNull: false,
            unique: true,
        },
        Password: {
            // hashed and salted password of user
            type: DataTypes.STRING,
            field: 'Password',
            allowNull: false,
        },
        Pending: {
            // denotes a user who has yet to create a password
            type: DataTypes.BOOLEAN,
            field: 'Pending',
            allowNull: false,
            defaultValue: true,
        },
        Attempts: {
            // number of incorrect password attempts since last successful login
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'Attempts',
            allowNull: false,
            defaultValue: 0,
        },
        Timeout: {
            // date and time after which user will be allowed to log in
            type: DataTypes.DATE,
            field: 'Timeout',
            allowNull: true,
        },
        Blocked: {
            // denotes a user who has been manually blocked (only by administrator)
            type: DataTypes.BOOLEAN,
            field: 'Blocked',
            allowNull: false,
            defaultValue: false,
        },
        LastLogin: {
            type: DataTypes.DATE,
            field: 'LastLogin',
            allowNull: true,
        },
    });

    UserLogin.associate = function (models) {
        models.UserLogin.belongsTo(models.User, {
            foreignKey: 'UserID',
        });
        models.UserLogin.hasOne(models.UserContact, {
            foreignKey: 'UserID',
        });
    };

    return UserLogin;
};
