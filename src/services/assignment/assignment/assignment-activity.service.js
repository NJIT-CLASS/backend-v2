import config from '../../../config';
import Logger from '../../../loaders/logger';
import models from '../../../models';

var { Assignment, sequelize } = models;

module.exports = {
    createAssignmentActivity,
    findOneAssignmentActivity,
    findAllAssignmentActivities,
    updateAssignmentActivity,
};

async function createAssignmentActivity(assignmentActivityObject, t) {
    const assignment = await Assignment.create(assignmentActivityObject, { transaction: t });

    if (assignment == null) {
        Logger.error('AssignmentService::createAssignmentActivity::Cannot create assignment activity');
        return null;
    } else {
        Logger.info('AssignmentService::createAssignmentActivity::AssignmentID: ' + assignment.AssignmentID);
        return assignment;
    }
}

async function findOneAssignmentActivity(attributes) {
    const assignment = await Assignment.findOne({
        where: attributes,
    });
    if (assignment == null) {
        Logger.info('AssignmentService::findOneAssignmentActivity::assignment not found');
        return null;
    } else {
        Logger.info('AssignmentService::findOneAssignmentActivity::AssignmentID: ' + assignment.AssignmentID);
        return assignment;
    }
}

async function findAllAssignmentActivities(attributes) {
    const assignments = await Assignment.findAll({
        where: attributes,
    });
    if (assignments == null) {
        Logger.info('AssignmentService::findAllAssignmentActivities:: assignments not found');
        return null;
    } else {
        Logger.info('AssignmentService::findAllAssignmentActivities::Count: ' + assignments.length);
        return assignments;
    }
}

async function updateAssignmentActivity(assignmentActivityObject, t) {
    const { AssignmentID, ...assignmentActivityObjectWithoutID } = assignmentActivityObject;
    const assignment = await Assignment.update(assignmentActivityObjectWithoutID, { where: { AssignmentID: AssignmentID }, transaction: t });

    Logger.info('AssignmentService::updateAssignmentActivity::AssignmentID: ' + assignment.AssignmentID);
    return assignment;
}
