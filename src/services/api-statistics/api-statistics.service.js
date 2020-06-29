import models from '../../models';
var { sequelize } = models;

module.exports = {
    apiStatistics,
    updateAPIStatistics,
};

// create api stat entry
async function apiStatistics(req, res, next) {
    var path = url.parse(req.url).pathname.replace(/[0-9]*/g, '');

    let insertAPIResult = await sequelize.query(' INSERT INTO apistatistics (StartTime, Route) VALUES(NOW(6), :route) ', {
        replacements: {
            route: path,
        },
    });

    req.statID = insertAPIResult[0].insertId;

    next();
}

// update api stat entry
async function updateAPIStatistics(req, res, next) {
    //overide json and end functions in res;
    let oldJson = res.json;
    let oldEnd = res.end;
    let statID = req.statID;
    res.json = function () {
        sequelize.query(' UPDATE apistatistics SET EndTime = NOW(6) WHERE StatID = :statID', {
            replacements: {
                statID: statID,
            },
        });

        oldJson.apply(this, arguments);
    };

    res.end = function () {
        sequelize.query(' UPDATE apistatistics SET EndTime = NOW(6) WHERE StatID = :statID', {
            replacements: {
                statID: statID,
            },
        });

        oldEnd.apply(this, arguments);
    };
    next();
}
