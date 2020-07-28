import { Promise } from 'bluebird';
import config from '../../../config';
import Logger from '../../../loaders/logger';
import models from '../../../models';
import responseService from '../../_helper/response.service';
import assignmentFactoryService from './assignment-factory.service';
import partialAssignmentService from '../partial-assignment/partial-assignment.service';

var { sequelize } = models;

module.exports = {
    createAssignmentSkeleton,
};

async function createAssignmentSkeleton(req, res, next) {
    try {
        if (req.body.assignment == null) {
            Logger.error('AssignmentFactoryController::createAssignmentSkeleton::Payload is empty');
            return res.status(400).send(await responseService.errorMessage('AssignmentFactoryController::createAssignmentSkeleton::Payload is empty'));
        }

        const t = await sequelize.transaction();
        if (req.body.partialAssignmentId == null) {
            const partialAssignment = await partialAssignmentService.createPartialAssignment(
                {
                    PartialAssignmentName: req.body.assignment.AA_name,
                    UserID: req.body.UserID,
                    CourseID: req.body.courseId,
                    Data: req.body.saveData,
                },
                t
            );
        } else {
            const partialAssignment = await partialAssignmentService.updatePartialAssignment(
                {
                    PartialAssignmentName: req.body.assignment.AA_name,
                    Data: req.body.saveData,
                    PartialAssignmentID: req.body.partialAssignmentId,
                },
                t
            );
        }

        const assignment = await assignmentFactoryService.createAssignmentSkeleton(req.body.assignment, t);
        await t.commit();

        res.status(200).json(
            await responseService.successMessage({
                Error: false,
                PartialAssignmentID: result.PartialAssignmentID,
            })
        );
    } catch (e) {
        Logger.error('AssignmentFactoryController::createAssignmentSkeleton::' + e);
        return res.status(500).send(await responseService.errorMessage('AssignmentFactoryController::createAssignmentSkeleton::' + e));
    }
}
