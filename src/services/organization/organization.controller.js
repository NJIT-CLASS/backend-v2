import config from '../../config';
import Logger from '../../loaders/logger';
import models from '../../models';
import responseService from '../_helper/response.service';
import organizationService from './organization.service';

var { Organization, sequelize } = models;

module.exports = {
    createOrganization,
    findOneOrganization,
    findAllOrganizations,
    updateOrganization,
    deleteOrganization,
};

async function createOrganization(req, res, next) {
    try {
        if (req.body.organizationname == null) {
            Logger.error('OrganizationController::createOrganization::Missing data');
            return res.status(400).send(await responseService.errorMessage('OrganizationController::createOrganization::Missing data'));
        }

        const organization = await organizationService.findOneOrganization({
            Name: req.body.organizationname,
        });

        if (organization != null) {
            Logger.error('OrganizationController::createOrganization::Organization already exist. OrganizationID: ' + organization.OrganizationID);
            return res
                .status(400)
                .send(
                    await responseService.errorMessage(
                        'OrganizationController::createOrganization::Organization already exist. OrganizationID: ' + organization.OrganizationID
                    )
                );
        }

        const t = await sequelize.transaction();
        const newOrganization = await organizationService.createOrganization({
            Name: req.body.organizationname,
        });

        if (newOrganization == null) {
            Logger.error('OrganizationController::createOrganization::Cannot create organization');
            return res.status(400).send(await responseService.errorMessage('OrganizationController::createOrganization::Cannot create organization'));
        } else {
            await t.commit();
            Logger.info('OrganizationController::createOrganization::OrganizationID: ' + newOrganization.OrganizationID);
            return res.status(200).send(
                await responseService.successMessage({
                    neworganization: newOrganization,
                    org_feedback: true,
                })
            );
        }
    } catch (e) {
        Logger.error('OrganizationController::createOrganization::' + e);
        return res.status(500).send(await responseService.errorMessage('OrganizationController::createOrganization::' + e));
    }
}

async function findOneOrganization(req, res, next) {
    try {
        if (req.params.organizationid == null) {
            Logger.error('OrganizationController::findOneOrganization::OrganizationID is null');
            return res.status(400).send(await responseService.errorMessage('OrganizationController::findOneOrganization::OrganizationID is null'));
        }

        const organization = await organizationService.findOneOrganization({
            OrganizationID: req.params.organizationid,
        });

        if (organization == null) {
            Logger.error('OrganizationController::findOneOrganization::Cannot find organization. OrganizationID: ' + req.params.organizationid);
            return res
                .status(400)
                .send(
                    await responseService.errorMessage(
                        'OrganizationController::findOneOrganization::Cannot find organization. OrganizationID: ' + req.params.organizationid
                    )
                );
        } else {
            Logger.info('OrganizationController::findOneOrganizations::OrganizationID: ' + organization.OrganizationID);
            return res.status(200).send(
                await responseService.successMessage({
                    Error: false,
                    Message: 'Success',
                    Organization: organization,
                })
            );
        }
    } catch (e) {
        Logger.error('OrganizationController::findOneOrganization::' + e);
        return res.status(500).send(await responseService.errorMessage('OrganizationController::findOneOrganization::' + e));
    }
}

async function findAllOrganizations(req, res, next) {
    try {
        const organizations = await organizationService.findAllOrganizations();

        if (organizations == null) {
            Logger.error('OrganizationController::findAllOrganizations::Cannot find organization');
            return res.status(400).send(await responseService.errorMessage('OrganizationController::findAllOrganizations::Cannot find organization'));
        } else {
            Logger.info('OrganizationController::findAllOrganizations::Count: ' + organizations.length);
            return res.status(200).send(
                await responseService.successMessage({
                    Error: false,
                    Message: 'Success',
                    Organization: organizations,
                })
            );
        }
    } catch (e) {
        Logger.error('OrganizationController::findAllOrganizations::' + e);
        return res.status(500).send(await responseService.errorMessage('OrganizationController::findAllOrganizations::' + e));
    }
}

async function updateOrganization(req, res, next) {
    try {
        if (req.body.Name == null || req.params.organizationid == null) {
            Logger.error('OrganizationController::updateOrganization::Missing data');
            return res.status(400).send(await responseService.errorMessage('OrganizationController::updateOrganization::Missing data'));
        }

        const t = await sequelize.transaction();
        const organization = await organizationService.updateOrganization(
            {
                Name: req.body.Name,
                OrganizationID: req.params.organizationid,
            },
            t
        );
        await t.commit();

        const updatedOrganization = await organizationService.findOneOrganization({
            Name: req.body.Name,
            OrganizationID: req.params.organizationid,
        });

        if (updatedOrganization == null) {
            Logger.error('OrganizationController::updateOrganization::Cannot update organization. OrganizationID: ' + req.params.organizationid);
            return res
                .status(400)
                .send(
                    await responseService.errorMessage(
                        'OrganizationController::updateOrganization::Cannot update organization. OrganizationID: ' + req.params.organizationid
                    )
                );
        } else {
            Logger.info('OrganizationController::updateOrganization::Cannot update organization. OrganizationID: ' + req.params.organizationid);
            return res.status(200).send(
                await responseService.successMessage({
                    Error: false,
                    Message: 'Success',
                    result: organization,
                    OrganizationUpdated: updatedOrganization,
                })
            );
        }
    } catch (e) {
        Logger.error('OrganizationController::updateOrganization::' + e);
        return res.status(500).send(await responseService.errorMessage('OrganizationController::updateOrganization::' + e));
    }
}

async function deleteOrganization(req, res, next) {
    try {
        if (req.params.organizationid == null) {
            Logger.error('OrganizationController::deleteOrganization::OrganizationID is null');
            return res.status(400).send(await responseService.errorMessage('OrganizationController::deleteOrganization::OrganizationID is null'));
        }

        const t = await sequelize.transaction();
        const organization = await organizationService.deleteOrganization(
            {
                OrganizationID: req.params.organizationid,
            },
            t
        );

        if (organization == null) {
            Logger.error('OrganizationController::deleteOrganization::Cannot delete Organization. OrganizationID: ' + req.params.organizationid);
            return res
                .status(400)
                .send(
                    await responseService.errorMessage(
                        'OrganizationController::deleteOrganization::Cannot delete Organization. OrganizationID: ' + req.params.organizationid
                    )
                );
        } else {
            await t.commit();
            Logger.info('OrganizationController::deleteOrganization::OrganizationID: ' + req.params.organizationid);
            return res.status(200).send(await responseService.successMessage('Success'));
        }
    } catch (e) {
        Logger.error('OrganizationController::deleteOrganization::' + e);
        return res.status(500).send(await responseService.errorMessage('OrganizationController::deleteOrganization::' + e));
    }
}
