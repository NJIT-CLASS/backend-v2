module.exports = function (sequelize, DataTypes) {
    var ArchivedAssignmentInstance = sequelize.define('ArchivedAssignmentInstance', {
        AssignmentInstanceID: {
            //Assignment instance ID
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'AssignmentInstanceID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        AssignmentID: {
            //identifier for Assignment (activity)
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'AssignmentID',
            allowNull: false,
        },
        SectionID: {
            //identifier for a section.
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SectionID',
            allowNull: false,
        },
        StartDate: {
            //Start date for the assignment. 0 means start immediately.
            type: DataTypes.DATE,
            field: 'StartDate',
            allowNull: true,
        },
        EndDate: {
            //Overall end date for all the workflows associated to this assignment to finish.
            type: DataTypes.DATE,
            field: 'EndDate',
            allowNull: true,
        },
        WorkflowCollection: {
            //Array of workflow instance ids corresponding to this assignment instance.
            type: DataTypes.JSON,
            field: 'WorkflowCollection',
            allowNull: true,
        },
        WorkflowTiming: {
            //Array of arrays of workflow instance and task instance timing parameters
            type: DataTypes.JSON,
            field: 'WorkflowTiming',
            allowNull: true,
        },
        Volunteers: {
            type: DataTypes.JSON,
            field: 'Volunteers',
            default: '[]',
        },
        DisplayName: {
            type: DataTypes.STRING,
            field: 'DisplayName',
            allowNull: false,
            default: '',
        },
    });

    ArchivedAssignmentInstance.associate = function (models) {
        models.ArchivedAssignmentInstance.belongsTo(models.Section, {
            foreignKey: 'SectionID',
        });
        models.ArchivedAssignmentInstance.belongsTo(models.ArchivedAssignment, {
            foreignKey: 'AssignmentID',
        });
        models.ArchivedAssignmentInstance.belongsTo(models.Assignment, {
            foreignKey: 'AssignmentID',
        });
    };

    return ArchivedAssignmentInstance;
};
