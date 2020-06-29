module.exports = function (sequelize, DataTypes) {
    var ArchivedAssignment = sequelize.define('ArchivedAssignment', {
        AssignmentID: {
            //Unique identifier for Assignment (activity)
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'AssignmentID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        OwnerID: {
            //The assignment’s owner.
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'OwnerID',
            allowNull: false,
        },
        WorkflowActivityIDs: {
            //*
            //WorkflowActivity_Assignment_IDs
            type: DataTypes.JSON,
            field: 'WorkflowActivityIDs',
            allowNull: true,
        },
        Instructions: {
            type: DataTypes.TEXT,
            field: 'Instructions',
            allowNull: true,
        },
        Documentation: {
            //Description of the Assignment
            type: DataTypes.TEXT,
            field: 'Documentation',
            allowNull: true,
        },
        GradeDistribution: {
            //Describes the percentage given for every workflow and distribution of grade for every task
            type: DataTypes.JSON,
            field: 'GradeDistribution',
            allowNull: true,
        },
        Name: {
            //Name of the assignment.
            type: DataTypes.STRING,
            field: 'Name',
            allowNull: true,
        },
        Type: {
            type: DataTypes.STRING,
            field: 'Type',
            allowNull: true,
        },
        DisplayName: {
            type: DataTypes.STRING,
            field: 'DisplayName',
            allowNull: true,
        },
        SectionID: {
            type: DataTypes.BLOB,
            field: 'SectionID',
            allowNull: true,
        },
        CourseID: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'CourseID',
            allowNull: false,
        },
        SemesterID: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SemesterID',
            allowNull: true,
        },
        VersionHistory: {
            type: DataTypes.JSON,
            field: 'VersionHistory',
            allowNull: true,
        },
    });

    ArchivedAssignment.associate = function (models) {
        models.ArchivedAssignment.belongsTo(models.Course, {
            foreignKey: 'CourseID',
        });
    };

    return ArchivedAssignment;
};
