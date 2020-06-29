import express from 'express';
import userController from '../../services/user/user.controller';

var router = express.Router();

export default async (app) => {
    app.use('/', router);
    //find all users
    router.get('/user', userController.findAll);
    //create a user with login and contact
    router.post('/user', userController.createUser);
    //create a fake user with login and contact
    router.post('/user/fake', userController.createFakeUser);
    //authenticate user
    router.post('/user/authenticate', userController.authenticate);
};
