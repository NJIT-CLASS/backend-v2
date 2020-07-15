import express from 'express';
import userController from '../../services/user/user.controller';

var router = express.Router();

export default async (app) => {
    app.use('/', router);
    //find all users
    router.get('/user', userController.findAll);
    //create a user with login and contact
    //router.post('/user', userController.createUser); TODO: future implementation to replace create user API
    router.post('/adduser', userController.createUser2);
    //create a fake user with login and contact
    router.post('/user/fake', userController.createFakeUser);
    //check if there is user in the system
    router.get('/initial', userController.checkInitialUser);
    //add first user to system
    router.post('/addInitialUser', userController.addInitialUser);
    //check user pending status
    router.get('/user/pendingStatus/:userId', userController.checkPendingStatus);
    //get user data by user id
    router.get('/generalUser/:userid', userController.getUserByUserID);
    //TODO: check if following endpoints are in use
    router.put('/update/email', userController.updateEmail); //TODO: make generic user update call

    router.put('/update/name', userController.updateName); //TODO: make generic user update call

    router.post('/update/password', userController.updatePassword); //TODO: make generic user update call

    router.post('/userContact', userController.updateContact);
};
