import express from 'express';
import sectionUserController from '../../services/section-user/section-user.controller';

var router = express.Router();

export default async (app) => {
    app.use('/', router);
    //find section users by id and role
    router.get('/sectionUsers/:sectionid/:role', sectionUserController.findSectionUserByIDAndRole);
    //create section user, if user doesnt exist create user and then create section user
    router.post('/sectionUsers/:sectionid', sectionUserController.createSectionUser);
    //Add many section users to the section, if user doesn't exist create the user
    router.post('/sectionUsers/addMany/:sectionid', sectionUserController.addManySectionUsers);
};
