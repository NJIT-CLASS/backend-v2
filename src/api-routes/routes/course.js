import express from 'express';
import courseController from '../../services/course/course.controller';

var router = express.Router();

export default async (app) => {
    app.use('/', router);
    //create course
    router.post('/course/create', courseController.createCourse);
    //Endpoint to find course
    router.get('/course/:courseId', courseController.findCourseWithSection);
    //update course
    router.post('/course/update', courseController.updateCourse);
};
