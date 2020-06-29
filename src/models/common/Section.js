module.exports = function (sequelize, DataTypes) {
    var Section = sequelize.define('Section', {
        SectionID: {
            //Unique identifier for the section
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SectionID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        SemesterID: {
            //Unique identifier for the semester
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SemesterID',
            allowNull: false,
        },
        CourseID: {
            //Unique identifier for the course
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'CourseID',
            allowNull: false,
        },
        // OrganizationID: {
        //    //Unique identifier for the organization
        //    //Foreign Key
        //    type: DataTypes.INTEGER.UNSIGNED,
        //    field: 'OrganizationID',
        //    allowNull: false
        // },
        Name: {
            //Name of the section (e.g. 001,002,h01)
            type: DataTypes.STRING(100),
            field: 'Name',
            allowNull: false,
        },
        Description: {
            type: DataTypes.STRING(255),
            field: 'Description',
            allowNull: true,
        },
    });

    Section.associate = function (models) {
        models.Section.hasMany(models.AssignmentInstance, {
            as: 'AssignmentInstances',
            foreignKey: 'SectionID',
        });
        models.Section.hasMany(models.SectionUser, {
            as: 'SectionUsers',
            foreignKey: 'SectionID',
        });
        models.Section.belongsTo(models.Semester, {
            foreignKey: 'SemesterID',
        });
        models.Section.belongsTo(models.Course, {
            foreignKey: 'CourseID',
        });
    };

    return Section;
};
