module.exports = function (sequelize, DataTypes) {
    var AssignmentInstance = sequelize.define('AssignmentInstance', {
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

    AssignmentInstance.associate = function (models) {
        models.AssignmentInstance.belongsTo(models.Section, {
            foreignKey: 'SectionID',
        });
        models.AssignmentInstance.belongsTo(models.Assignment, {
            foreignKey: 'AssignmentID',
        });
        models.AssignmentInstance.hasMany(models.TaskInstance, {
            as: 'TaskInstances',
            foreignKey: 'AssignmentInstanceID',
        });
        models.AssignmentInstance.hasMany(models.WorkflowInstance, {
            as: 'WorkflowInstances',
            foreignKey: 'AssignmentInstanceID',
        });
        models.AssignmentInstance.hasMany(models.Comments, {
            as: 'Comments',
            foreignKey: 'AssignmentInstanceID',
        });
    };

    return AssignmentInstance;
};
