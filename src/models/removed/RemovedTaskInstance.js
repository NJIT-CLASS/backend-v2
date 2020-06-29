module.exports = function (sequelize, DataTypes) {
    var RemovedTaskInstance = sequelize.define('RemovedTaskInstance', {
        TaskInstanceID: {
            //Unique Identifier for the task instance.
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'TaskInstanceID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        UserID: {
            //Id of the user assigned to this task
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'UserID',
            allowNull: true,
        },
        TaskActivityID: {
            //Unique Identifier for the task activity.
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'TaskActivityID',
            allowNull: false,
        },
        WorkflowInstanceID: {
            //Unique identifier for a workflow instance.
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'WorkflowInstanceID',
            allowNull: false,
        },
        AssignmentInstanceID: {
            //Unique identifier for Assignment instance.
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'AssignmentInstanceID',
            allowNull: false,
        },
        GroupID: {
            //Id of the group assigned to this task (not currently used)
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'GroupID',
            allowNull: true, //Should be false, but not needed in the system now
        },
        Status: {
            //Current status of the task instance
            type: DataTypes.STRING,
            field: 'Status',
            allowNull: true,
        },
        StartDate: {
            //Time stamp for task instance start.
            type: DataTypes.DATE,
            field: 'StartDate',
            allowNull: true,
        },
        EndDate: {
            //End date of the task
            type: DataTypes.DATE,
            field: 'EndDate',
            allowNull: true,
        },
        ActualEndDate: {
            type: DataTypes.DATE,
            field: 'ActualEndDate',
            allowNull: true,
        },
        Data: {
            //User’s input is stored here. For non-display tasks, this will hold the value calculated by the task’s function.
            type: DataTypes.JSON,
            field: 'Data',
            allowNull: true,
        },
        UserHistory: {
            //Prior users assigned to this task instance, if reallocated (will be refined in future versions)
            type: DataTypes.JSON,
            field: 'UserHistory',
            allowNull: true,
        },
        FinalGrade: {
            //Will hold a potential final grade for the “referred_to” task_activity, or be null if it does not. This will be a single consolidated grade, not the individual criteria subgrades.
            type: DataTypes.FLOAT.UNSIGNED,
            field: 'FinalGrade',
            allowNull: true,
        },
        Files: {
            //File identifiers when uploaded by users (when uploaded as user input)
            type: DataTypes.JSON,
            field: 'Files',
            allowNull: true,
        },
        ReferencedTask: {
            //Task_ID of the referenced task, if any.
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'ReferencedTask',
            allowNull: true,
        },
        IsSubWorkflow: {
            type: DataTypes.INTEGER,
            field: 'IsSubworkflow',
            allowNull: true,
        },
        NextTask: {
            //Array of possible next
            type: DataTypes.JSON,
            field: 'NextTask',
            allowNull: true,
        },
        PreviousTask: {
            //Array of possible previous
            type: DataTypes.JSON,
            field: 'PreviousTask',
            allowNull: true,
        },
        EmailLastSent: {
            //The Record of when the last email was sent.
            //Keep a whole array of email history
            type: DataTypes.DATE,
            field: 'EmailLastSent',
            allowNull: false,
            defaultValue: '1999-01-01T00:00:00',
        },
        DueType: {
            //* DueType
            //Maximum duration of the task in minutes
            type: DataTypes.JSON,
            field: 'DueType',
            allowNull: true,
        },
        TAType: {
            type: DataTypes.STRING(40),
            field: 'TAType',
            allowNull: true,
        },
        TASimpleGrade: {
            //"exists" or "late" or "off_per_day(%) " or "none"
            type: DataTypes.STRING(20),
            field: 'TASimpleGrade',
            allowNull: true,
        },
        GradableTask: {
            type: DataTypes.INTEGER,
            field: 'GradableTask',
            allowNull: true,
            defaultValue: 0, //default value 0 means not gradable, 1 gradable
        },
        ExtraCredit: {
            type: DataTypes.INTEGER,
            field: 'ExtraCredit',
            allowNull: true,
            defaultValue: 0,
        },
    });

    return RemovedTaskInstance;
};
