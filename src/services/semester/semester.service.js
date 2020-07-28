import models from '../../models';
import Logger from '../../loaders/logger';

var { Semester, sequelize } = models;

module.exports = {
    createSemester,
    findOneSemester,
    findAllSemesters,
    deleteSemester,
    updateSemester,
};

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
    const semester = await Semester.findAll({
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

async function updateSemester(semesterObject, t) {
    const { SemesterID, ...semesterObjectWithoutID } = semesterObject;
    const semester = await Semester.update(semesterObjectWithoutID, {
        where: {
            SemesterID: SemesterID,
        },
        transaction: t,
    });
    Logger.info('SemesterService::updateSemester::SemesterID: ' + semester.SemesterID);
    return semester;
}

async function deleteSemester(attributes, t) {
    const semester = await Semester.destroy({
        where: attributes,
        transaction: t,
    });
    if (semester == null) {
        Logger.info('SemesterService::delete::Cannot delete semester');
        return null;
    } else {
        Logger.info('SemesterService::delete::Deleted semester');
        return semester;
    }
}
