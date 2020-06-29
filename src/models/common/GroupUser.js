module.exports = function (sequelize, DataTypes) {
    var GroupUser = sequelize.define('GroupUser', {
        GroupID: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'GroupID',
            allowNull: false,
            primaryKey: true,
        },
        UserID: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'UserID',
            allowNull: false,
        },
        Role: {
            type: DataTypes.INTEGER,
            field: 'Role',
            allowNull: false,
            validate: {
                isIn: [['Student', 'Instructor']],
            },
        },
        Status: {
            type: DataTypes.STRING,
            field: 'Status',
            allowNull: false,
            validate: {
                isIn: [['Active', 'Inactive']],
            },
        },
    });

    GroupUser.associate = function (models) {
        models.GroupUser.belongsTo(models.User, {
            foreignKey: 'UserID',
        });
    };

    return GroupUser;
};
