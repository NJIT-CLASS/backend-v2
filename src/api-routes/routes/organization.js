import express from 'express';
import organizationController from '../../services/organization/organization.controller';

var router = express.Router();

export default async (app) => {
    app.use('/', router);
    //create new organization
    router.post('/createorganization', organizationController.createOrganization);
    //get all organizations
    router.get('/organization', organizationController.findAllOrganizations);
    //get organization by id
    router.get('/organization/:organizationid', organizationController.findOneOrganization);
    //delete organization by id
    router.get('/organization/delete/:organizationid', organizationController.deleteOrganization);
    //update organization by id
    router.post('/organization/update/:organizationid', organizationController.updateOrganization);
};
