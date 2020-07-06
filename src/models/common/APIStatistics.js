module.exports = function (sequelize, DataTypes) {
    var APIStatistics = sequelize.define(
        'APIStatistics',
        {
            StatID: {
                //Unique identifier for the section
                type: DataTypes.INTEGER.UNSIGNED,
                field: 'StatID',
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
            StartTime: {
                //Unique identifier for the semester
                //Foreign Key
                type: DataTypes.DATE(6),
                field: 'StartTime',
                allowNull: true,
            },
            EndTime: {
                //Unique identifier for the course
                //Foreign Key
                type: DataTypes.DATE(6),
                field: 'EndTime',
                allowNull: true,
            },
            Route: {
                type: DataTypes.STRING(2000),
                field: 'Route',
                allowNull: false,
            },
        },
        {
            timestamps: false,
        }
    );

    return APIStatistics;
};
