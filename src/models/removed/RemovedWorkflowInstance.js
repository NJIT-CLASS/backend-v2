module.exports = function (sequelize, DataTypes) {
    var RemovedWorkflowInstance = sequelize.define('RemovedWorkflowInstance', {
        WorkflowInstanceID: {
            //Unique identifier for the workflow instance.
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'WorkflowInstanceID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        WorkflowActivityID: {
            //Unique identifier for workflow activity.
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'WorkflowActivityID',
            allowNull: false,
        },
        AssignmentInstanceID: {
            //Unique identifier for assignment instance
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'AssignmentInstanceID',
            allowNull: false,
        },
        StartTime: {
            //Start date of the workflow instance
            type: DataTypes.DATE,
            field: 'StartTime',
            allowNull: true,
        },
        EndTime: {
            //Scheduled end date of the workflow instance
            type: DataTypes.DATE,
            field: 'EndTime',
            allowNull: true,
        },
        TaskCollection: {
            //Array of task instance ids corresponding to this workflow instance.
            type: DataTypes.JSON,
            field: 'TaskCollection',
            allowNull: true,
        },
        Data: {
            //Any data for the workflow instance instead of tasks. (Not currently used.)
            type: DataTypes.JSON,
            field: 'Data',
            allownull: true,
        },
        /*Volunteers: {
            type: DataTypes.JSON,
            field: 'Volunteers',
            default: '[]'
        }*/
    });

    return RemovedWorkflowInstance;
};
