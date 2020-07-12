import models from '../../models';
import Logger from '../../loaders/logger';

var { Semester, sequelize } = models;

module.exports = { createSemester, findOneSemester, findAllSemesters };

async function createSemester(semesterObject, t) {
    const semester = await Semester.create(semesterObject, {
        transaction: t,
    });

    if (semester == null) {
        Logger.info('SemesterService::createSemester::Cannot create semester');
        return null;
    } else {
        Logger.info('SemesterService::createSemester::SemesterID: ' + semester.SemesterID);
        return semester;
    }
}

async function findOneSemester(attributes) {
    const semester = await Semester.findOne({
        where: attributes,
    });
    if (semester == null) {
        Logger.info('SemesterService::findOneSemester::Semester not found');
        return null;
    } else {
        Logger.info('SemesterService::findOneSemester::SemesterID: ' + semester.SemesterID);
        return semester;
    }
}

async function findAllSemesters(attributes) {
    const semester = await Semester.findOne({
        where: attributes,
    });
    if (semester == null) {
        Logger.info('SemesterService::findAllSemesters::Semester not found');
        return null;
    } else {
        Logger.info('SemesterService::findAllSemesters::Count:' + semester.length);
        return semester;
    }
}
