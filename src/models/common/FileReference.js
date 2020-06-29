module.exports = function (sequelize, DataTypes) {
    var FileReference = sequelize.define('FileReference', {
        FileID: {
            //File ID
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'FileID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        UserID: {
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'UserID',
            allowNull: false,
        },
        Info: {
            type: DataTypes.JSON,
            field: 'Info',
            allowNull: true,
        },
        LastUpdated: {
            //File record Last updated/inserted date
            type: DataTypes.DATE,
            field: 'LastUpdated',
            allowNull: true,
        },
    });

    FileReference.associate = function (models) {
        models.FileReference.belongsTo(models.User, {
            foreignKey: 'UserID',
        });
    };

    return FileReference;
};
