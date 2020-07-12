import semesterService from './semester.service';
import Logger from '../../loaders/logger';
import dateFormat from 'dateFormat';
import responseService from '../_helper/response.service';
import models from '../../models';
var { Semester, sequelize } = models;

module.exports = {
    createSemester,
    findOneSemester,
    findAllSemesters,
};

async function createSemester(req, res, next) {
    try {
        const startDate = dateFormat(req.body.start_sem, 'yyyy-mm-dd');
        const endDate = dateFormat(req.body.end_sem, 'yyyy-mm-dd');

        if (req.body.end_sem == null || req.body.start_sem == null || req.body.organizationID == null || req.body.semesterName == null) {
            Logger.error('SemesterController::createSemester::Missing data');
            return res.status(400).send(await responseService.errorMessage('SemesterController::createSemester::Missing data'));
        } else if (startDate > endDate) {
            Logger.error('SemesterController::createSemester::End date greater than start date');
            return res.status(400).send(await responseService.errorMessage('SemesterController::createSemester::End date greater than start date'));
        }

        const semester = await semesterService.findOneSemester({
            OrganizationID: req.body.organizationID,
            Name: req.body.semesterName,
        });

        if (semester == null) {
            const t = await sequelize.transaction();
            const newSemester = await semesterService.createSemester(
                {
                    OrganizationID: req.body.organizationID,
                    Name: req.body.semesterName,
                    StartDate: req.body.start_sem,
                    EndDate: req.body.end_sem,
                },
                t
            );

            if (newSemester != null) {
                await t.commit();
                return res.status(200).send(
                    await responseService.successMessage({
                        newsemester: newSemester,
                        sem_feedback: true,
                    })
                );
            } else {
                Logger.error('SemesterController::createSemester::Cannot create a new semester');
                return res.status(400).send(await responseService.errorMessage('SemesterController::createSemester::Cannot create a new semester'));
            }
        } else {
            Logger.error('SemesterController::createSemester:: Semester exists. OrganizationID: ' + req.body.organizationID);
            return res.status(200).send(
                await responseService.successMessage({
                    newsemester: semester,
                    sem_feedback: true,
                })
            );
        }
    } catch (e) {
        Logger.error('SemesterController::createSemester::' + e);
        return res.status(500).send(await responseService.errorMessage('SemesterController::createSemester::' + e));
    }
}

async function findOneSemester(req, res, next) {
    try {
        const semesterId = req.params.semesterid;
        const semester = await semesterService.findOneSemester({
            SemesterID: semesterId,
        });

        if (semester == null) {
            Logger.error('SemesterController::createSemester::Semester not found. SemesterID: ' + semesterId);
            return res
                .status(400)
                .send(await responseService.errorMessage('SemesterController::createSemester::Semester not found. SemesterID: ' + semesterId));
        } else {
            return res.status(200).send(
                await responseService.successMessage({
                    Error: false,
                    Message: 'Success',
                    Semester: semester,
                })
            );
        }
    } catch (e) {
        Logger.error('SemesterController::findOneSemester::' + e);
        return res.status(500).send(await responseService.errorMessage('SemesterController::findOneSemester::' + e));
    }
}

async function findAllSemesters(req, res, next) {
    try {
        const semesters = await Semester.findAll();

        if (semesters == null) {
            Logger.error('SemesterController::findAllSemesters::No semester found');
            return res.status(400).send(await responseService.errorMessage('SemesterController::findAllSemester::No semester found'));
        } else {
            Logger.info('SemesterController::findAllSemesters::Semesters found. Count: ' + semesters.length);
            return res.status(200).send(
                await responseService.successMessage({
                    Error: false,
                    Message: 'Success',
                    Semesters: semesters,
                })
            );
        }
    } catch (e) {
        Logger.error('SemesterController::findAllSemesters::' + e);
        return res.status(500).send(await responseService.errorMessage('SemesterController::findAllSemesters::' + e));
    }
}
