import config from '../../../config';
import Logger from '../../../loaders/logger';
import models from '../../../models';
import responseService from '../../_helper/response.service';

var { TaskInstance, sequelize } = models;

module.exports = {
    getPendingTaskInstances,
    getCompletedTaskInstances,
};

async function getPendingTaskInstances(req, res, next) {
    try {
        if (req.params.userID === null) {
            Logger.error('TaskInstanceController::getPendingTaskInstance:: UserID is empty');
            return res.status(400).send(await responseService.errorMessage('TaskInstanceController::getPendingTaskInstance:: UserID is empty'));
        }

        const tis = await TaskInstance.findAll({
            where: {
                UserID: req.params.userID,
                $and: [
                    {
                        Status: {
                            $notLike: '%"cancelled"%',
                        },
                    },
                    {
                        $or: [
                            {
                                Status: {
                                    $like: '%"incomplete"%',
                                },
                            },
                            {
                                Status: {
                                    $like: '%"started"%',
                                },
                            },
                        ],
                    },
                ],
            },

            attributes: ['TaskInstanceID', 'UserID', 'WorkflowInstanceID', 'StartDate', 'EndDate', 'Status'],
            include: [
                ///// Need new mappings in index.js AssignmentInstance -> Assignment, Assignment ::=> AssignmentInstance
                {
                    model: AssignmentInstance,
                    attributes: ['AssignmentInstanceID', 'AssignmentID'],
                    include: [
                        {
                            model: Section,
                            attributes: ['SectionID', 'Name'],
                            include: [
                                {
                                    model: Course,
                                    attributes: ['Name', 'CourseID', 'Number'],
                                },
                            ],
                        },
                        {
                            model: Assignment,
                            attributes: ['Name'],
                        },
                    ],
                },
                /*TaskInstance - > AssignmentInstance - > Section - > Course */
                {
                    model: TaskActivity,
                    attributes: ['Name', 'DisplayName', 'Type', 'AllowRevision', 'MustCompleteThisFirst'],
                    include: [
                        {
                            model: WorkflowActivity,
                            attributes: ['Name'],
                        },
                    ],
                },
            ],
        });

        if (tis != null) {
            Logger.info('TaskInstanceController::getPendingTaskInstances:: Count: ' + tis.length);
            res.status(200).json(
                await responseService.successMessage({
                    Error: false,
                    PendingTaskInstances: tis,
                })
            );
        } else {
            Logger.error('TaskInstanceController::getPendingTaskInstance:: Cannot find pending tasks');
            return res.status(400).send(await responseService.errorMessage('TaskInstanceController::getPendingTaskInstance:: Cannot find pending tasks'));
        }
    } catch (e) {
        Logger.error('TaskInstanceController::getPendingTaskInstance:: Cannot find pending tasks');
        return res.status(500).send(await responseService.errorMessage('TaskInstanceController::getPendingTaskInstance:: Cannot find pending tasks'));
    }
}

async function getCompletedTaskInstances(req, res, next) {
    try {
        if (req.params.userID === null) {
            Logger.error('TaskInstanceController::getCompletedTaskInstances:: UserID is empty');
            return res.status(400).send(await responseService.errorMessage('TaskInstanceController::getCompletedTaskInstances:: UserID is empty'));
        }

        const tis = await TaskInstance.findAll({
            where: {
                UserID: req.params.userID,
                Status: {
                    $like: '%"complete"%',
                },
            },
            attributes: ['TaskInstanceID', 'UserID', 'WorkflowInstanceID', 'StartDate', 'EndDate', 'Status', 'ActualEndDate'],
            include: [
                ///// Need new mappings in index.js AssignmentInstance -> Assignment, Assignment ::=> AssignmentInstance
                {
                    model: AssignmentInstance,
                    attributes: ['AssignmentInstanceID', 'AssignmentID'],
                    include: [
                        {
                            model: Section,
                            attributes: ['SectionID', 'Name'],
                            include: [
                                {
                                    model: Course,
                                    attributes: ['Name', 'CourseID', 'Number'],
                                },
                            ],
                        },
                        {
                            model: Assignment,
                            attributes: ['Name'],
                        },
                    ],
                },
                {
                    model: TaskActivity,
                    attributes: ['Name', 'DisplayName', 'Type', 'VisualID'],
                    include: [
                        {
                            model: WorkflowActivity,
                            attributes: ['Name'],
                        },
                    ],
                },
            ],
        });

        if (tis != null) {
            Logger.info('TaskInstanceController::getCompletedTaskInstances:: Count: ' + tis.length);
            res.status(200).json(
                await responseService.successMessage({
                    Error: false,
                    CompletedTaskInstances: tis,
                })
            );
        } else {
            Logger.error('TaskInstanceController::getCompletedTaskInstances:: Cannot find pending tasks');
            return res.status(400).send(await responseService.errorMessage('TaskInstanceController::getCompletedTaskInstances:: Cannot find pending tasks'));
        }
    } catch (e) {
        Logger.error('TaskInstanceController::getCompletedTaskInstances:: Cannot find pending tasks');
        return res.status(500).send(await responseService.errorMessage('TaskInstanceController::getCompletedTaskInstances:: Cannot find pending tasks'));
    }
}
