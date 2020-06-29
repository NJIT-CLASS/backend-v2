module.exports = function (sequelize, DataTypes) {
    var ResetPasswordRequest = sequelize.define('ResetPasswordRequest', {
        UserID: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'UserID',
            allowNull: false,
            primaryKey: true,
        },
        RequestHash: {
            type: DataTypes.STRING,
            field: 'RequestHash',
            allowNull: false,
            primaryKey: true,
        },
    });

    return ResetPasswordRequest;
};
