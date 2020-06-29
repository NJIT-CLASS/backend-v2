module.exports = function (sequelize, DataTypes) {
    var Organization = sequelize.define('Organization', {
        OrganizationID: {
            //Unique identifier for the organization
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'OrganizationID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        Name: {
            //Name of the organization
            type: DataTypes.STRING(40),
            field: 'Name',
            allowNull: true,
        },
        Logo: {
            type: DataTypes.JSON,
            field: 'Logo',
            allowNull: true,
        },
    });

    return Organization;
};
