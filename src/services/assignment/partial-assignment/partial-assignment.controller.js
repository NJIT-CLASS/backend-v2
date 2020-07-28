import config from '../../../config';
import Logger from '../../../loaders/logger';
import models from '../../../models';
import responseService from '../../_helper/response.service';
import partialAssignmentService from './partial-assignment.service';

var { sequelize } = models;
module.exports = {
    findAllPartialAssignmentsByID,
    findOnePartialAssignment,
    savePartialAssignment,
};

async function findAllPartialAssignmentsByID(req, res, next) {
    try {
        if (req.params.userId == null) {
            Logger.error('PartialAssignmentController::findAllPartialAssignmentsByID::Missing user id');
            return res.status(400).send(await responseService.errorMessage('PartialAssignmentController::findAllPartialAssignmentsByID::Missing user id'));
        }

        let options = {
            UserID: req.params.userId,
        };

        if (req.query.courseId != null) {
            options.CourseID = req.query.courseId;
        }

        const partialAssignments = await partialAssignmentService.findAllPartialAssignments(options);

        if (partialAssignments == null) {
            Logger.error('PartialAssignmentController::findAllPartialAssignmentsByID::Partial assignment not found');
            return res
                .status(400)
                .send(await responseService.errorMessage('PartialAssignmentController::findAllPartialAssignmentsByID::Partial assignment not found'));
        } else {
            Logger.info('PartialAssignmentController::findAllPartialAssignmentsByID::Count: ' + partialAssignments.length);
            return res.status(200).json(
                await responseService.successMessage({
                    Error: false,
                    PartialAssignments: partialAssignments,
                })
            );
        }
    } catch (e) {
        Logger.error('PartialAssignmentController::findAllPartialAssignmentsByID::' + e);
        return res.status(500).send(await responseService.errorMessage('PartialAssignmentController::findAllPartialAssignmentsByID::' + e));
    }
}

async function findOnePartialAssignment(req, res, next) {
    try {
        if (req.params.partialAssignmentId == null) {
            Logger.error('PartialAssignmentController::findOnePartialAssignment::Missing data');
            return res.status(400).send(await responseService.errorMessage('PartialAssignmentController::findOnePartialAssignment::Missing data'));
        }

        const partialAssignment = await partialAssignmentService.findOnePartialAssignment({
            PartialAssignmentID: req.params.partialAssignmentId,
        });

        if (partialAssignment == null) {
            Logger.error('PartialAssignmentController::findOnePartialAssignment::Partial assignment not found');
            return res
                .status(400)
                .send(await responseService.errorMessage('PartialAssignmentController::findOnePartialAssignment::Partial assignment not found'));
        } else {
            Logger.info('PartialAssignmentController::findOnePartialAssignment::PartialAssignmentID: ' + partialAssignment.PartialAssignmentID);
            return res.status(200).json(
                await responseService.successMessage({
                    Error: false,
                    PartialAssignment: partialAssignment,
                })
            );
        }
    } catch (e) {
        Logger.error('PartialAssignmentController::findAllPartialAssignmentsByID::' + e);
        return res.status(500).send(await responseService.errorMessage('PartialAssignmentController::findAllPartialAssignmentsByID::' + e));
    }
}

async function savePartialAssignment(req, res, next) {
    try {
        if (req.body.partialAssignmentId == null) {
            const t = await sequelize.transaction();
            const partialAssignment = await partialAssignmentService.createPartialAssignment(
                {
                    PartialAssignmentName: req.body.assignment.AA_name,
                    UserID: req.body.UserID,
                    CourseID: req.body.courseId,
                    Data: req.body.assignment,
                },
                t
            );

            if (partialAssignment == null) {
                Logger.error('PartialAssignmentController::savePartialAssignment::Cannot create partial assignment');
                return res
                    .status(400)
                    .send(await responseService.errorMessage('PartialAssignmentController::savePartialAssignment::Cannot create partial assignment'));
            } else {
                await t.commit();
                Logger.info('PartialAssignmentController::savePartialAssignment::PartialAssignmentID: ' + partialAssignment.PartialAssignmentID);
                return res.status(200).json(
                    await responseService.successMessage({
                        Error: false,
                        PartialAssignmentID: partialAssignment.PartialAssignmentID,
                    })
                );
            }
        } else {
            const t = await sequelize.transaction();
            const partialAssignment = await partialAssignmentService.updatePartialAssignment(
                {
                    PartialAssignmentName: req.body.assignment.AA_name,
                    Data: req.body.assignment,
                    PartialAssignmentID: req.body.partialAssignmentId,
                },
                t
            );

            if (partialAssignment == null) {
                Logger.error('PartialAssignmentController::savePartialAssignment::Cannot create partial assignment');
                return res
                    .status(400)
                    .send(await responseService.errorMessage('PartialAssignmentController::savePartialAssignment::Cannot create partial assignment'));
            } else {
                await t.commit();
                Logger.info('PartialAssignmentController::savePartialAssignment::PartialAssignmentID: ' + partialAssignment.PartialAssignmentID);
                return res.status(200).json(
                    await responseService.successMessage({
                        Error: false,
                        PartialAssignmentID: req.body.partialAssignmentId,
                    })
                );
            }
        }
    } catch (e) {
        Logger.error('PartialAssignmentController::savePartialAssignment::' + e);
        return res.status(500).send(await responseService.errorMessage('PartialAssignmentController::savePartialAssignment::' + e));
    }
}
