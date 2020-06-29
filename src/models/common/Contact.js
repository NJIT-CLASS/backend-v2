module.exports = function (sequelize, DataTypes) {
    var Contact = sequelize.define('Contact', {
        UserID: {
            //Unique identifier for the user
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'UserID',
            allowNull: false,
        },
        Email: {
            // preferred email for notifications
            type: DataTypes.STRING(70),
            field: 'Email',
            allowNull: true,
            unique: true,
        },
        FirstName: {
            //Official first name of the user
            type: DataTypes.STRING(40),
            field: 'FirstName',
            allowNull: true,
        },
        LastName: {
            //Official last name of the user
            type: DataTypes.STRING(40),
            field: 'LastName',
            allowNull: true,
        },
        Global: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'Global',
            allowNull: true,
        },
        OrganizationGroup: {
            //Array of organization IDs to which the user is part of
            type: DataTypes.JSON,
            field: 'OrganizationGroup',
            allowTrue: true,
        },
    });

    Contact.associate = function (models) {
        models.Contact.belongsTo(models.User, {
            foreignKey: 'UserID',
        });
    };

    return Contact;
};
