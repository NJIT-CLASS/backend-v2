import config from '../../../config';
import Logger from '../../../loaders/logger';
import models from '../../../models';

var { PartialAssignments, sequelize } = models;

module.exports = {
    createPartialAssignment,
    findOnePartialAssignment,
    findAllPartialAssignments,
    updatePartialAssignment,
};

async function createPartialAssignment(partialAssignmentObject, t) {
    const partialAssignment = await PartialAssignments.create(partialAssignmentObject, { transaction: t });

    if (partialAssignment == null) {
        Logger.error('PartialAssignmentService::createPartialAssignment::Cannot create partial assignment');
        return null;
    } else {
        Logger.info('PartialAssignmentService::createPartialAssignment::PartialAssignmentID: ' + partialAssignment.PartialAssignmentID);
        return partialAssignment;
    }
}

async function findOnePartialAssignment(attributes) {
    const partialAssignment = await PartialAssignments.findOne({
        where: attributes,
    });
    if (partialAssignment == null) {
        Logger.info('PartialAssignmentService::findOnePartialAssignment::Partial assignment not found');
        return null;
    } else {
        Logger.info('PartialAssignmentService::findOnePartialAssignment::PartialAssignmentID: ' + partialAssignment.partialAssignmentID);
        return partialAssignment;
    }
}

async function findAllPartialAssignments(attributes) {
    const partialAssignments = await PartialAssignments.findAll({
        where: attributes,
    });
    if (partialAssignments == null) {
        Logger.info('PartialAssignmentService::findAllPartialAssignments::Partial assignment not found');
        return null;
    } else {
        Logger.info('PartialAssignmentService::findAllPartialAssignments::Count: ' + partialAssignments.length);
        return partialAssignments;
    }
}

async function updatePartialAssignment(partialAssignmentObject, t) {
    const { PartialAssignmentID, ...partialAssignmentObjectWithoutID } = partialAssignmentObject;
    const partialAssignment = await PartialAssignments.update(partialAssignmentObjectWithoutID, {
        where: { PartialAssignmentID: PartialAssignmentID },
        transaction: t,
    });

    Logger.info('PartialAssignmentService::updatePartialAssignment::PartialAssignmentID: ' + partialAssignment.PartialAssignmentID);
    return partialAssignment;
}
