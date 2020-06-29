module.exports = function (sequelize, DataTypes) {
    var ExtraCredit = sequelize.define('ExtraCredit', {
        SectionUserID: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'SectionUserID',
            allowNull: false,
            primaryKey: true,
            unique: true,
        },
        Points: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'Points',
            allowNull: false,
            defaultValue: 1,
        },
    });

    ExtraCredit.associate = function (models) {
        models.ExtraCredit.belongsTo(models.SectionUser, {
            foreignKey: 'SectionUserID',
        });
    };

    return ExtraCredit;
};
