import express from 'express';
import semesterController from '../../services/semester/semester.controller';

var router = express.Router();

export default async (app) => {
    app.use('/', router);
    //create a new semester
    router.post('/createSemester', semesterController.createSemester);
    //find semester by id
    router.get('/semester/:semesterid', semesterController.findOneSemester);
    //find all semesters
    router.get('/semester', semesterController.findAllSemesters);
    //find semesters by organizationid
    router.get('/getOrganizationSemesters/:organizationID', semesterController.findSemestersByOrganizationID);
    //delete semester
    router.get('/semester/delete/:semesterid', semesterController.deleteSemester);
    //update semester
    router.post('/semester/update/:semesterid', semesterController.updateSemester);
};
