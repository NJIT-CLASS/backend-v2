module.exports = function (sequelize, DataTypes) {
    var Notifications = sequelize.define('Notifications', {
        NotificationsID: {
            //Unique identifier for the Notification.
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'NotificationsID',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        NotificationTarget: {
            type: DataTypes.STRING(40),
            field: 'NotificationTarget',
            allowNull: true,
        },
        UserID: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'UserID',
            allowNull: true,
        },
        TargetID: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'TargetID',
            allowNull: true,
        },
        OriginTaskInstanceID: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'OriginTaskInstanceID',
            allowNull: true,
        },
        Info: {
            type: DataTypes.STRING(40),
            field: 'Info',
            allowNull: true,
        },
        Dismiss: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'Dismiss',
            allowNull: true,
        },
        Time: {
            // date and time after which user will be allowed to log in
            type: DataTypes.DATE,
            field: 'Time',
            allowNull: true,
        },
        DismissType: {
            type: DataTypes.STRING(45),
            field: 'DismissType',
            allowNull: true,
        },
    });

    return Notifications;
};
