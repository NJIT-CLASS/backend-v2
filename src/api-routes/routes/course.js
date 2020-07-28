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
    //get courses by organization id
    router.get('/getOrganizationCourses/:organizationID', courseController.getCourseByOrganizationID);
    //delete course by id
    router.get('/course/delete/:courseid', courseController.deleteCourse);
    //get courses under instructor
    router.get('/getCourseCreated/:instructorID', courseController.findInstructorCourses);
};
