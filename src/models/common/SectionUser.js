module.exports = function (sequelize, DataTypes) {
    var SectionUser = sequelize.define('SectionUser', {
        SectionUserID: {
            //Unique ID for this composite.
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SectionUserID',
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
        },
        SectionID: {
            //Unique identified for the section
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SectionID',
            allowNull: false,
        },
        UserID: {
            //Unique identifier for the user
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'UserID',
            allowNull: false,
        },
        Role: {
            //Role of the user in the course on the respective semester
            type: DataTypes.STRING(30),
            field: 'Role',
            allowNull: false,
            defaultValue: 'Student',
            validate: {
                isIn: [['Student', 'Instructor', 'Observer']],
            },
        },
        Active: {
            type: DataTypes.BOOLEAN,
            field: 'Active',
            allowNull: false,
            defaultValue: true,
        },
        Volunteer: {
            type: DataTypes.STRING(20),
            field: 'Volunteer',
            allowNull: true,
            defaultValue: 0,
        },
    });

    SectionUser.associate = function (models) {
        models.SectionUser.belongsTo(models.User, {
            foreignKey: 'UserID',
        });
        models.SectionUser.belongsTo(models.Section, {
            foreignKey: 'SectionID',
        });
        models.SectionUser.belongsTo(models.UserLogin, {
            foreignKey: 'UserID',
        });
    };

    return SectionUser;
};
