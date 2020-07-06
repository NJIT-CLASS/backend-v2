import express from 'express';
import authController from '../../services/auth/auth.controller';

var router = express.Router();

export default async (app) => {
    app.use('/', router);
    //authenticate user to login
    router.post('/login', authController.authenticate);
    //reset password
    router.post('/password/reset', authController.resetPassword);
};
