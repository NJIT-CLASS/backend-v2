module.exports = function (sequelize, DataTypes) {
    var VolunteerPool = sequelize.define('VolunteerPool', {
        VolunteerPoolID: {
            //Unique identifier for the user
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'VolunteerPoolID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        UserID: {
            //Unique identifier for the user
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'UserID',
            allowNull: false,
        },
        SectionID: {
            //Unique identifier for the section
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SectionID',
            allowNull: false,
        },
        AssignmentInstanceID: {
            //Unique identifier for assignment instance ID
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'AssignmentInstanceID',
            allowNull: true,
        },
        status: {
            //Unique identifier for assignment instance ID
            type: DataTypes.STRING(25),
            field: 'status',
            allowNull: true,
        },
    });

    VolunteerPool.associate = function (models) {
        models.VolunteerPool.belongsTo(models.User, {
            foreignKey: 'UserID',
        });
        models.VolunteerPool.belongsTo(models.User, {
            foreignKey: 'UserID',
        });
        models.VolunteerPool.belongsTo(models.Section, {
            foreignKey: 'SectionID',
        });
    };

    return VolunteerPool;
};
