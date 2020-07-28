import config from '../../../config';
import Logger from '../../../loaders/logger';
import models from '../../../models';

var { Assignment, sequelize } = models;

module.exports = {
    createAssignment,
    findOneAssignment,
};

async function createAssignment(assignmentObject, t) {
    const assignment = await Assignment.create(assignmentObject, { transaction: t });

    if (assignment == null) {
        Logger.error('AssignmentService::createAssignment::Cannot create assignment');
        return null;
    } else {
        Logger.info('AssignmentService::createAssignment::AssignmentID: ' + assignment.AssignmentID);
        return assignment;
    }
}

async function findOneAssignment(attributes) {
    const assignment = await Assignment.findOne({
        where: attributes,
    });
    if (assignment == null) {
        Logger.info('AssignmentService::findOneAssignment::Assignment not found');
        return null;
    } else {
        Logger.info('AssignmentService::findOneAssignment::AssignmentID: ' + assignment.AssignmentID);
        return assignment;
    }
}
