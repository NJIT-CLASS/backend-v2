import config from '../../../config';
import Logger from '../../../loaders/logger';
import models from '../../../models';

var { TaskInstance, sequelize } = models;

module.exports = {
    createTaskInstance,
    findOneTaskInstance,
    findAllTaskInstances,
    updateTaskInstance,
};

async function createTaskInstance(taskInstanceObject, t) {
    const task = await TaskInstance.create(taskInstanceObject, { transaction: t });

    if (task == null) {
        Logger.error('TaskService::createTaskInstance::Cannot create Task Instance');
        return null;
    } else {
        Logger.info('TaskService::createTaskInstance::TaskInstanceID: ' + task.TaskActivityID);
        return task;
    }
}

async function findOneTaskInstance(attributes) {
    const task = await TaskInstance.findOne({
        where: attributes,
    });
    if (task == null) {
        Logger.info('TaskService::findOneTaskInstance::Task not found');
        return null;
    } else {
        Logger.info('TaskService::findOneTaskInstance::TaskInstanceID: ' + task.TaskInstanceID);
        return task;
    }
}

async function findAllTaskInstances(attributes) {
    const tasks = await TaskActivity.findAll({
        where: attributes,
    });
    if (tasks == null) {
        Logger.info('TaskService::findAllTaskInstances:: Tasks not found');
        return null;
    } else {
        Logger.info('TaskService::findAllTaskInstances::Count: ' + tasks.length);
        return tasks;
    }
}

async function updateTaskInstance(taskInstanceObject, t) {
    const { TaskInstanceID, ...taskInstanceObjectWithoutID } = TaskInstanceObject;
    const task = await TaskInstance.update(taskInstanceObjectWithoutID, { where: { TaskInstanceID: TaskInstanceID }, transaction: t });

    Logger.info('TaskService::updateTaskInstance::TaskInstanceID: ' + task.TaskInstanceID);
    return task;
}
