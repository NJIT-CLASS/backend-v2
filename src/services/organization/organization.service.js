import config from '../../config';
import Logger from '../../loaders/logger';
import models from '../../models';
import responseService from '../_helper/response.service';
var { Organization, sequelize } = models;

module.exports = {
    createOrganization,
    findOneOrganization,
    findAllOrganizations,
    deleteOrganization,
    updateOrganization,
};

async function createOrganization(organizationObject, t) {
    const organization = await Organization.create(organizationObject, { transaction: t });

    if (organization == null) {
        Logger.error('OrganizationService::createOrganization::Cannot create organization');
        return null;
    } else {
        Logger.info('OrganizationService::createOrganization::OrganizationID: ' + organization.OrganizationID);
        return organization;
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
        Logger.info('OrganizationService::findOneOrganization::OrganizationID: ' + organization.OrganizationID);
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
        Logger.info('OrganizationService::findAllOrganizations::Count: ' + organization.length);
        return organization;
    }
}

async function deleteOrganization(attributes, t) {
    const organization = await Organization.destroy(
        {
            where: attributes,
        },
        {
            transaction: t,
        }
    );

    if (organization == null) {
        Logger.info('OrganizationService::deleteOrganizations::Cannot delete organization');
        return null;
    } else {
        Logger.info('OrganizationService::deleteOrganizations::Deleted organization');
        return organization;
    }
}

async function updateOrganization(organizationObject, t) {
    const { OrganizationID, ...organizationObjectWithoutID } = organizationObject;
    const organization = await Organization.update(
        organizationObjectWithoutID,
        {
            where: {
                OrganizationID: OrganizationID,
            },
        },
        {
            transaction: t,
        }
    );

    Logger.info('OrganizationService::updateOrganizations::Updated organization');
    return organization;
}
