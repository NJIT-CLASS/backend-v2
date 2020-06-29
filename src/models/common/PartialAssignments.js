module.exports = function (sequelize, DataTypes) {
    var PartialAssignments = sequelize.define('PartialAssignments', {
        PartialAssignmentID: {
            //Unique identifier for the organization
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'PartialAssignmentID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        UserID: {
            //Unique identifier for the user.
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'UserID',
            allowNull: false,
        },
        CourseID: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'CourseID',
            allowNull: false,
        },
        PartialAssignmentName: {
            type: DataTypes.STRING(255),
            field: 'PartialAssignmentName',
            allowNull: true,
        },
        Data: {
            type: DataTypes.JSON,
            field: 'Data',
            allowNull: false,
        },
    });

    PartialAssignments.associate = function (models) {
        models.PartialAssignments.belongsTo(models.User, {
            foreignKey: 'UserID',
        });
        models.PartialAssignments.belongsTo(models.Course, {
            foreignKey: 'CourseID',
        });
    };

    return PartialAssignments;
};
