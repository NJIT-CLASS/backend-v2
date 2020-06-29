module.exports = function (sequelize, DataTypes) {
    var SectionUserRecord = sequelize.define('SectionUserRecord', {
        SectionUserID: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SectionUserID',
            allowNull: false,
            primaryKey: true,
            unique: true,
        },
        LevelInstanceID: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'LevelInstanceID',
            allowNull: false,
        },
        SectionID: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SectionID',
            allowNull: false,
        },
        Title: {
            type: DataTypes.STRING,
            field: 'Title',
            allowNull: false,
        },
        Level: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'Level',
            defaultValue: 1,
        },
        Exp: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'Exp',
            defaultValue: 0,
        },
        ThresholdPoints: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'ThresholdPoints',
            allowNull: false,
        },
        AvailablePoints: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'AvailablePoints',
            allowNull: false,
            defaultValue: 0,
        },
        UsedPoints: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'UsedPoints',
            defaultValue: 0,
        },
        PlusPoint: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'PlusPoint',
            defaultValue: 0,
        },
        GoalProgression: {
            type: DataTypes.JSON,
            field: 'GoalInstances',
            allowNull: false,
        },
    });

    return SectionUserRecord;
};
