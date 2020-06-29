module.exports = function (sequelize, DataTypes) {
    var CommentsViewed = sequelize.define('CommentsViewed', {
        CommentsViewedID: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'CommentsViewedID',
            allowNull: true,
            primaryKey: true,
        },
        CommentsID: {
            //Unique identifier for the user
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'CommentsID',
            allowNull: true,
        },
        UserID: {
            //Unique identifier for the user
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'UserID',
            allowNull: true,
        },
        Time: {
            // date and time after which user will be allowed to log in
            type: DataTypes.DATE,
            field: 'Time',
            allowNull: true,
        },
    });

    return CommentsViewed;
};
