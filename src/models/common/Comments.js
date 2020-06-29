module.exports = function (sequelize, DataTypes) {
    var Comments = sequelize.define('Comments', {
        CommentsID: {
            //Unique identifier for the user
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'CommentsID',
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
        TargetID: {
            //Unique identifier for the user
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'TargetID',
            allowNull: false,
        },
        AssignmentInstanceID: {
            //Unique identifier for assignment instance
            //Foreign Key
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'AssignmentInstanceID',
            allowNull: true,
        },
        // TaskInstanceID: {
        //     //Unique identifier for assignment instance
        //     //Foreign Key
        //     type: DataTypes.INTEGER.UNSIGNED,
        //     field: 'TaskInstanceID',
        //     allowNull: true
        // },
        Type: {
            type: DataTypes.STRING,
            field: 'Type',
            allowNull: true,
        },
        CommentsText: {
            type: DataTypes.STRING,
            field: 'CommentsText',
            allowNull: true,
        },
        Rating: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'Rating',
            allowNull: true,
        },
        Flag: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'Flag',
            allowNull: true,
        },
        Status: {
            type: DataTypes.STRING(255),
            field: 'Status',
            allowNull: true,
        },
        Label: {
            type: DataTypes.STRING(255),
            field: 'Label',
            allowNull: true,
        },
        Viewed: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'Viewed',
            allowNull: true,
        },
        ReplyLevel: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'ReplyLevel',
            allowNull: true,
        },
        Parents: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'Parents',
            allowNull: true,
        },
        Delete: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'Delete',
            allowNull: true,
        },
        Time: {
            // date and time after which user will be allowed to log in
            type: DataTypes.DATE,
            field: 'Time',
            allowNull: true,
        },
        Complete: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'Complete',
            allowNull: true,
        },
        Hide: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'Hide',
            allowNull: true,
        },
        CommentTarget: {
            type: DataTypes.STRING(255),
            field: 'CommentTarget',
            allowNull: true,
        },
    });

    return Comments;
};
