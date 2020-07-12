import express from 'express';
import organizationController from '../../services/organization/organization.controller';

var router = express.Router();

export default async (app) => {
    app.use('/', router);
    //create new organization
    router.post('/createorganization', organizationController.createOrganization);
};
