import express from 'express';
import sectionController from '../../services/section/section.controller';

var router = express.Router();

export default async (app) => {
    app.use('/', router);
    //create new section
    router.post('/course/createsection', sectionController.createSection);
    //update section
    router.post('/course/updatesection', sectionController.updateSection);
};
