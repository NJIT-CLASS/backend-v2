'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
var config = require('../config');
var db = {};

const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPass, {
    host: config.databaseURL,
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: false,
});

fs.readdirSync(__dirname + '/archived/')
    .filter((file) => {
        return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
    })
    .forEach((file) => {
        var model = require(path.join(__dirname + '/archived/', file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

fs.readdirSync(__dirname + '/common/')
    .filter((file) => {
        return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
    })
    .forEach((file) => {
        var model = require(path.join(__dirname + '/common/', file))(sequelize, Sequelize.DataTypes);

        db[model.name] = model;
    });

fs.readdirSync(__dirname + '/removed/')
    .filter((file) => {
        return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
    })
    .forEach((file) => {
        var model = require(path.join(__dirname + '/removed/', file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// sequelize
//     .query('SET FOREIGN_KEY_CHECKS = 0')
//     .then(function () {
//         return sequelize.sync({
//             force: true,
//             // logging: console.log
//         });
//     })
//     .then(function () {
//         return sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
//     })
//     .then(
//         function () {
//             console.log('Database synchronised.');
//         },
//         function (err) {
//             console.log(err);
//         }
//     );

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
