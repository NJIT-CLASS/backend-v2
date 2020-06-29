module.exports = function (sequelize, DataTypes) {
    var CourseBackUp = sequelize.define('CourseBackUp', {
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
            allowNull: true,
        },
        Name: {
            //Name of the course
            type: DataTypes.STRING(150),
            field: 'Name',
            allowNull: true,
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
            allowNull: true,
        },
        Abbreviations: {
            type: DataTypes.STRING,
            field: 'Abbreviations',
            allowNull: true,
        },
        Description: {
            type: DataTypes.STRING,
            field: 'Description',
            allowNull: true,
        },
    });

    return CourseBackUp;
};
