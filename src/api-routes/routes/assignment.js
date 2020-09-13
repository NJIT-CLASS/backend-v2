import express from 'express';
import partialAssignmentController from '../../services/assignment/partial-assignment/partial-assignment.controller';
import assignmentFactoryController from '../../services/assignment/assignment-factory/assignment-factory.controller';
import taskInstanceController from '../../services/assignment/task/task-instance.controller';

var router = express.Router();

export default async (app) => {
    app.use('/', router);
    //create assignment
    router.post('/assignment/create', assignmentFactoryController.createAssignmentSkeleton);
    //save partial assignment
    router.post('/assignment/save/', partialAssignmentController.savePartialAssignment);
    //get partial assignment by id
    router.get('/partialAssignments/byId/:partialAssignmentId', partialAssignmentController.findOnePartialAssignment);
    //Endpoint to load the names and IDs partial assignments by User and/or CourseID
    router.get('/partialAssignments/all/:userId', partialAssignmentController.findAllPartialAssignmentsByID);
    //get pending task instances
    router.get('/getPendingTaskInstances/:userID', taskInstanceController.getPendingTaskInstances);
    //get completed task instances
    router.get('/getCompletedTaskInstances/:userID', taskInstanceController.getCompletedTaskInstances);
};
