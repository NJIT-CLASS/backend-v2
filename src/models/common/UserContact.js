module.exports = function (sequelize, DataTypes) {
    var UserContact = sequelize.define('UserContact', {
        UserID: {
            // unique contact identifier
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'UserID',
            allowNull: false,
            primaryKey: true,
        },
        Email: {
            // preferred email for notifications
            type: DataTypes.STRING(70),
            field: 'Email',
            allowNull: true,
            unique: true,
        },
        Phone: {
            // preferred phone number for notificationms
            type: DataTypes.STRING(25),
            field: 'Phone',
            allowNull: true,
        },
        FirstName: {
            // preferred first name of the user
            type: DataTypes.STRING(40),
            field: 'FirstName',
            allowNull: true,
        },
        LastName: {
            // preferred last name of the user
            type: DataTypes.STRING(40),
            field: 'LastName',
            allowNull: true,
        },
        Alias: {
            // alias of the user
            type: DataTypes.STRING(40),
            field: 'Alias',
            allowNull: true,
        },
        ProfilePicture: {
            // profile picture of user
            type: DataTypes.JSON,
            field: 'ProfilePicture',
            allowNull: true,
        },
        Avatar: {
            // graphical avatar of user
            type: DataTypes.JSON,
            field: 'Avatar',
            allowNull: true,
        },
        UseAlternateEmail: {
            // keep note if user wants alternate email for notifications
            type: DataTypes.BOOLEAN,
            field: 'UseAlternateEmail',
            allowNull: false,
            defaultValue: false,
        },
        AdministrativeSupport: {
            //Is OverAll admin Support, Or support for listed Organizations
            type: DataTypes.JSON,
            field: 'AdministrativeSupport',
            allowNull: true,
        },
        TechnicalSupport: {
            //Is OverAll Technical Support, Or support for listed Organizations
            type: DataTypes.JSON,
            field: 'TechnicalSupport',
            allowNull: true,
        },
    });

    UserContact.associate = function (models) {
        models.UserContact.belongsTo(models.User, {
            foreignKey: 'UserID',
        });
        models.UserContact.belongsTo(models.UserLogin, {
            foreignKey: 'UserID',
        });
    };

    return UserContact;
};
