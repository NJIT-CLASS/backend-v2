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
    findSemestersByOrganizationID,
    deleteSemester,
    updateSemester,
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
            Logger.error('SemesterController::findOneSemester::Semester not found. SemesterID: ' + semesterId);
            return res
                .status(400)
                .send(await responseService.errorMessage('SemesterController::findOneSemester::Semester not found. SemesterID: ' + semesterId));
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

async function findSemestersByOrganizationID(req, res, next) {
    try {
        const organizationID = req.params.organizationID;
        const semesters = await semesterService.findAllSemesters({
            OrganizationID: organizationID,
        });

        if (semesters == null) {
            Logger.error('SemesterController::findSemestersByOrganizationID::Semester not found. SemesterID: ' + semesterId);
            return res
                .status(400)
                .send(await responseService.errorMessage('SemesterController::findSemestersByOrganizationID::Semester not found. SemesterID: ' + semesterId));
        } else {
            return res.status(200).send(
                await responseService.successMessage({
                    Error: false,
                    Message: 'Success',
                    Semesters: semesters,
                })
            );
        }
    } catch (e) {
        Logger.error('SemesterController::findSemestersByOrganizationID::' + e);
        return res.status(500).send(await responseService.errorMessage('SemesterController::findSemestersByOrganizationID::' + e));
    }
}

async function findAllSemesters(req, res, next) {
    try {
        const semesters = await semesterService.findAllSemesters(req.body);

        if (semesters == null) {
            Logger.error('SemesterController::findAllSemesters::No semester found');
            return res.status(400).send(await responseService.errorMessage('SemesterController::findAllSemesters::No semester found'));
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

async function updateSemester(req, res, next) {
    try {
        if (req.params.semesterid == null || req.body.Name == null || req.body.Start == null || req.body.End == null) {
            Logger.error('SemesterController::updateSemester::Missing data');
            return res.status(400).send(await responseService.errorMessage('SemesterController::updateSemester::Missing data'));
        }

        const t = await sequelize.transaction();
        const semester = await semesterService.updateSemester(
            {
                SemesterID: req.params.semesterid,
                Name: req.body.Name,
                StartDate: req.body.Start,
                EndDate: req.body.End,
            },
            t
        );

        if (semester == null) {
            Logger.error('SemesterController::updateSemester::Cannot update semester. SemesterID: ' + req.params.semesterid);
            return res
                .status(400)
                .send(await responseService.errorMessage('SemesterController::updateSemester::Cannot update semester. SemesterID: ' + req.params.semesterid));
        } else {
            await t.commit();

            const updatedSemester = await semesterService.findOneSemester({
                SemesterID: req.params.semesterid,
                Name: req.body.Name,
                StartDate: req.body.Start,
                EndDate: req.body.End,
            });

            Logger.info('SemesterController::updateSemester::SemesterID: ' + semester.semesterID);
            res.status(200).json(
                await responseService.successMessage({
                    Error: false,
                    Message: 'Success',
                    result: semester,
                    CourseUpdated: updatedSemester,
                })
            );
        }
    } catch (e) {
        Logger.error('SectionController::deleteSection::' + e);
        return res.status(500).send(await responseService.errorMessage('SectionController::deleteSection::' + e));
    }
}

async function deleteSemester(req, res, next) {
    try {
        if (req.params.semesterid == null) {
            Logger.error('SemesterController::deleteSemester::SemesterID is null');
            return res.status(400).send(await responseService.errorMessage('SemesterController::deleteSemester::SemesterID is null'));
        }

        const t = await sequelize.transaction();
        const semester = await semesterService.deleteSemester(
            {
                SemesterID: req.params.semesterid,
            },
            t
        );

        if (semester == null) {
            Logger.error('SemesterController::deleteSemester::Cannot find semester. SemesterID: ' + req.params.semesterid);
            return res
                .status(400)
                .send(await responseService.errorMessage('SemesterController::deleteSemester::Cannot find semester. SemesterID: ' + req.params.semesterid));
        } else {
            await t.commit();
            Logger.info('SemesterController::deleteSemester::SemesterID: ' + semester.semesterID);
            res.status(200).json(
                await responseService.successMessage({
                    Error: false,
                    Message: 'Success',
                    Semester: semester,
                })
            );
        }
    } catch (e) {
        Logger.error('SemesterController::deleteSemester::' + e);
        return res.status(500).send(await responseService.errorMessage('SemesterController::deleteSemester::' + e));
    }
}
