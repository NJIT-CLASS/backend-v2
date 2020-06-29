module.exports = function (sequelize, DataTypes) {
    var Course = sequelize.define('Course', {
        CourseID: {
            //Unique identifier for the course
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'CourseID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        Number: {
            //Number of the course (e.g. Chem101,Math101)
            type: DataTypes.STRING(50),
            field: 'Number',
            allowNull: false,
        },
        Name: {
            //Name of the course
            type: DataTypes.STRING(150),
            field: 'Name',
            allowNull: false,
        },
        OrganizationID: {
            //Unique identifier for the organization
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'OrganizationID',
            allowNull: false,
        },
        CreatorID: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'CreatorID',
            allowNull: false,
        },
        Description: {
            type: DataTypes.TEXT,
            field: 'Description',
            allowNull: true,
        },
    });

    Course.associate = function (models) {
        models.Course.belongsTo(models.Organization, {
            foreignKey: 'OrganizationID',
        });
        models.Course.hasMany(models.Section, {
            as: 'Sections',
            foreignKey: 'CourseID',
        });
        models.Course.belongsTo(models.Organization, {
            foreignKey: 'OrganizationID',
        });
        models.Course.belongsTo(models.User, {
            foreignKey: 'CreatorID',
        });
    };

    return Course;
};
