module.exports = function (sequelize, DataTypes) {
    var AssignmentGrade = sequelize.define('AssignmentGrade', {
        AssignmentGradeID: {
            //Assignment grade ID
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'AssignmentGradeID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        AssignmentInstanceID: {
            //Unique with SectionUserID.
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'AssignmentInstanceID',
            allowNull: false,
            unique: 'ai_sectionUserId_unq_idx',
        },
        SectionUserID: {
            //Unique with AssignmentInstanceID
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SectionUserID',
            allowNull: false,
            unique: 'ai_sectionUserId_unq_idx',
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

    AssignmentGrade.associate = function (models) {
        models.AssignmentGrade.belongsTo(models.AssignmentInstance, {
            foreignKey: 'AssignmentInstanceID',
        });
        models.AssignmentGrade.belongsTo(models.SectionUser, {
            foreignKey: 'SectionUserID',
        });
    };

    return AssignmentGrade;
};
