module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        UserID: {
            //Unique identifier for the user.
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'UserID',
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
        },
        FirstName: {
            //Official first name of the user
            type: DataTypes.STRING(40),
            field: 'FirstName',
            allowNull: true,
        },
        LastName: {
            //Official last name of the user
            type: DataTypes.STRING(40),
            field: 'LastName',
            allowNull: true,
        },
        Instructor: {
            type: DataTypes.BOOLEAN,
            field: 'Instructor',
            allowNull: false,
            defaultValue: false,
        },
        Admin: {
            //Indicate whether the user is Admin
            type: DataTypes.BOOLEAN,
            field: 'Admin',
            allowNull: false,
            defaultValue: false,
        },
        OrganizationGroup: {
            //Array of organization IDs to which the user is part of
            type: DataTypes.JSON,
            field: 'OrganizationGroup',
            allowTrue: true,
        },
        Role: {
            //Official first name of the user
            type: DataTypes.STRING(40),
            field: 'Role',
            allowNull: true,
        },
    });

    User.associate = function (models) {
        models.User.hasOne(models.UserLogin, {
            foreignKey: 'UserID',
        });
        models.User.hasOne(models.UserContact, {
            foreignKey: 'UserID',
        });
        models.User.hasMany(models.SectionUser, {
            as: 'Users',
            foreignKey: 'UserID',
        });
        models.User.hasMany(models.GroupUser, {
            as: 'GroupUsers',
            foreignKey: 'UserID',
        });
        models.User.hasMany(models.TaskInstance, {
            as: 'TaskInstances',
            foreignKey: 'UserID',
        });
        models.User.hasMany(models.VolunteerPool, {
            foreignKey: 'UserID',
        });
        models.User.hasMany(models.Comments, {
            as: 'Comments',
            foreignKey: 'UserID',
        });
    };

    return User;
};
