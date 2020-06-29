module.exports = function (sequelize, DataTypes) {
    var Group = sequelize.define('Group', {
        GroupID: {
            //Unique identifier for the group.
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'GroupID',
            allowNull: false,
            primaryKey: true,
            unique: true,
        },
        SectionID: {
            //Unique identifier for the section
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SectionID',
            allowNull: false,
        },
        Name: {
            //Name of the group
            type: DataTypes.STRING(30),
            field: 'Name',
            allowNull: true,
        },
        Leader: {
            //Stores the ID of the user in the group with the authority to make decisions on behalf of the group. It is optional.
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'Leader',
            allowNull: true,
        },
        List: {
            //Array of users
            type: DataTypes.BLOB,
            field: 'List',
            allowNull: true,
        },
    });

    return Group;
};
