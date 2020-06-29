module.exports = function (sequelize, DataTypes) {
    var WorkflowGrade = sequelize.define('WorkflowGrade', {
        WorkflowGradeID: {
            //Workflow grade ID
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'WorkflowGradeID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        WorkflowActivityID: {
            //Unique with SectionUserID.
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'WorkflowActivityID',
            allowNull: false,
            unique: 'wf_sectionUserId_unq_idx',
        },
        SectionUserID: {
            //Unique with WorkflowActivityID
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SectionUserID',
            allowNull: false,
            unique: 'wf_sectionUserId_unq_idx',
        },
        AssignmentInstanceID: {
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'AssignmentInstanceID',
            allowNull: false,
        },
        WorkflowInstanceID: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'WorkflowInstanceID',
            allowNull: false,
        },
        Grade: {
            type: DataTypes.DOUBLE,
            field: 'Grade',
            allowNull: false,
        },
        Comments: {
            type: DataTypes.STRING,
            field: 'Comments',
            allowNull: true,
        },
    });

    WorkflowGrade.associate = function (models) {
        models.WorkflowGrade.belongsTo(models.WorkflowActivity, {
            foreignKey: 'WorkflowActivityID',
        });
        models.WorkflowGrade.belongsTo(models.AssignmentInstance, {
            foreignKey: 'AssignmentInstanceID',
        });
        models.WorkflowGrade.belongsTo(models.SectionUser, {
            foreignKey: 'SectionUserID',
        });
    };

    return WorkflowGrade;
};
