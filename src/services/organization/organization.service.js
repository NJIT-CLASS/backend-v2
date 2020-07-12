import config from '../../config';
import Logger from '../../loaders/logger';
import models from '../../models';

var { Organization, sequelize } = models;

module.exports = {
    createOrganization,
    findOneOrganization,
    findAllOrganizations
}

async function createOrganization(organizationObject, t){
    const organization = await Organization.create(organizationObject,{ transaction: t});

    if(organization == null){
        Logger.error("OrganizationService::createOrganization::Cannot create organization");
        return null;
    } else {
        Logger.info("OrganizationService::createOrganization::OrganizationID: " organization.OrganizationID);
        return organization
    }
}

async function findOneOrganization(attributes) {
    const organization = await Organization.findOne({
        where: attributes,
    });
    
    if (organization == null) {
        Logger.info('OrganizationService::findOneOrganization::Organization not found');
        return null;
    } else {
        Logger.info('OrganizationService::findOneOrganization::OrganizationID: ' + Organization.OrganizationID);
        return organization;
    }
}

async function findAllOrganizations(attributes) {
    const organization = await Organization.findAll({
        where: attributes,
    });
    
    if (organization == null) {
        Logger.info('OrganizationService::findAllOrganizations::Organization not found');
        return null;
    } else {
        Logger.info('OrganizationService::findAllOrganizations::Count: ' + Organization.length);
        return organization;
    }
}