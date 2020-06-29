module.exports = function (sequelize, DataTypes) {
    var ArchivedTaskSimpleGrade = sequelize.define('ArchivedTaskSimpleGrade', {
        TaskSimpleGradeID: {
            //TaskSimple grade ID
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'TaskSimpleGradeID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        TaskInstanceID: {
            //Unique with SectionUserID.
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'TaskInstanceID',
            allowNull: false,
            unique: 'ti_sectionUserId_unq_idx',
        },
        SectionUserID: {
            //Unique with TaskInstanceID
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SectionUserID',
            allowNull: false,
            unique: 'ti_sectionUserId_unq_idx',
        },
        WorkflowActivityID: {
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'WorkflowActivityID',
            allowNull: false,
        },
        TaskActivityID: {
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'TaskActivityID',
            allowNull: false,
        },
        AssignmentInstanceID: {
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'AssignmentInstanceID',
            allowNull: false,
        },
        WorkflowInstanceID: {
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'WorkflowInstanceID',
            allowNull: false,
        },

        Grade: {
            type: DataTypes.FLOAT.UNSIGNED,
            field: 'Grade',
            allowNull: false,
        },
        TIExtraCredit: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'TIExtraCredit',
            allowNull: false,
        },
        Comments: {
            type: DataTypes.STRING,
            field: 'Comments',
            allowNull: true,
        },
        TADisplayName: {
            // The default should be a name that makes sense to the user and also conveys our intent, such as “Optionally decide to dispute” for the dispute task.  (*See Notes document)
            type: DataTypes.STRING,
            field: 'TADisplayName',
            allowNull: true,
        },
        WADisplayName: {
            // The default should be a name that makes sense to the user and also conveys our intent, such as “Optionally decide to dispute” for the dispute task.  (*See Notes document)
            type: DataTypes.STRING,
            field: 'WADisplayName',
            allowNull: true,
        },
        DaysLate: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'DaysLate',
            allowNull: true,
        },
        DailyPenalty: {
            type: DataTypes.FLOAT.UNSIGNED,
            field: 'DailyPenalty',
            allowNull: true,
        },
    });

    return ArchivedTaskSimpleGrade;
};
