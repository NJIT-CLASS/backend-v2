import config from '../../../config';
import Logger from '../../../loaders/logger';
import models from '../../../models';

var { TaskActivity, sequelize } = models;

module.exports = {
    createTaskActivity,
    findOneTaskActivity,
    findAllTaskActivities,
    updateTaskActivity,
};

async function createTaskActivity(taskActivityObject, t) {
    const task = await TaskActivity.create(taskActivityObject, { transaction: t });

    if (task == null) {
        Logger.error('TaskService::createTaskActivity::Cannot create Task activity');
        return null;
    } else {
        Logger.info('TaskService::createTaskActivity::TaskActivityID: ' + task.TaskActivityID);
        return task;
    }
}

async function findOneTaskActivity(attributes) {
    const task = await TaskActivity.findOne({
        where: attributes,
    });
    if (task == null) {
        Logger.info('TaskService::findOneTaskActivity::Task not found');
        return null;
    } else {
        Logger.info('TaskService::findOneTaskActivity::TaskActivityID: ' + task.TaskActivityID);
        return task;
    }
}

async function findAllTaskActivities(attributes) {
    const tasks = await TaskActivity.findAll({
        where: attributes,
    });
    if (tasks == null) {
        Logger.info('TaskService::findAllTaskActivities:: Tasks not found');
        return null;
    } else {
        Logger.info('TaskService::findAllTaskActivities::Count: ' + tasks.length);
        return tasks;
    }
}

async function updateTaskActivity(taskActivityObject, t) {
    const { TaskActivityID, ...taskActivityObjectWithoutID } = TaskActivityObject;
    const task = await TaskActivity.update(taskActivityObjectWithoutID, { where: { TaskActivityID: TaskActivityID }, transaction: t });

    Logger.info('TaskService::updateTaskActivity::TaskActivityID: ' + task.TaskActivityID);
    return task;
}
