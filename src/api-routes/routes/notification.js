import express from 'express';
import authController from '../../services/auth/auth.controller';

var router = express.Router();

export default async (app) => {
    app.use('/', router);
};
