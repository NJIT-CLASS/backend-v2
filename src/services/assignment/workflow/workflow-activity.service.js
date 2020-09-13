import config from '../../../config';
import Logger from '../../../loaders/logger';
import models from '../../../models';

var { WorkflowActivity, sequelize } = models;

module.exports = {
    createWorkflowActivity,
    findOneWorkflowActivity,
    findAllWorkflowActivities,
    updateWorkflowActivity,
};

async function createWorkflowActivity(workflowActivityObject, t) {
    const workflow = await WorkflowActivity.create(workflowActivityObject, { transaction: t });
    if (workflow == null) {
        Logger.error('WorkflowService::createWorkflowActivity::Cannot create workflow activity');
        return null;
    } else {
        Logger.info('WorkflowService::createWorkflowActivity::WorkflowActivityID: ' + workflow.WorkflowActivityID);
        return workflow;
    }
}

async function findOneWorkflowActivity(attributes) {
    const workflow = await WorkflowActivity.findOne({
        where: attributes,
    });
    if (workflow == null) {
        Logger.info('WorkflowService::findOneWorkflowActivity::Workflow not found');
        return null;
    } else {
        Logger.info('WorkflowService::findOneWorkflowActivity::WorkflowActivityID: ' + workflow.WorkflowActivityID);
        return workflow;
    }
}

async function findAllWorkflowActivities(attributes) {
    const workflows = await WorkflowActivity.findAll({
        where: attributes,
    });
    if (workflows == null) {
        Logger.info('WorkflowService::findAllWorkflowActivities:: Workflows not found');
        return null;
    } else {
        Logger.info('WorkflowService::findAllWorkflowActivities::Count: ' + workflows.length);
        return workflows;
    }
}

async function updateWorkflowActivity(workflowActivityObject, t) {
    const { WorkflowActivityID, ...workflowActivityObjectWithoutID } = workflowActivityObject;
    const workflow = await WorkflowActivity.update(workflowActivityObjectWithoutID, { where: { WorkflowActivityID: WorkflowActivityID }, transaction: t });

    Logger.info('WorkflowService::updateWorkflowActivity::WorkflowActivityID: ' + workflow);
    return workflow;
}
