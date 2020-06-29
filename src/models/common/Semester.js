module.exports = function (sequelize, DataTypes) {
    var Semester = sequelize.define('Semester', {
        SemesterID: {
            //Unique identifier for the semester
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SemesterID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        OrganizationID: {
            //Unique identifier for the organization
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'OrganizationID',
            allowNull: false,
        },
        Name: {
            //Name of the semester (e.g. Fall2017,Winter2016)
            type: DataTypes.STRING(25),
            field: 'Name',
            allowNull: true,
        },
        StartDate: {
            //Start date of the semester
            type: DataTypes.DATEONLY,
            field: 'StartDate',
            allowNull: true,
        },
        EndDate: {
            //End date of the semester
            type: DataTypes.DATEONLY,
            field: 'EndDate',
            allowNull: true,
        },
    });

    Semester.associate = function (models) {
        models.Semester.hasMany(models.Section, {
            as: 'Sections',
            foreignKey: 'SemesterID',
        });
    };

    return Semester;
};
