import config from '../../config';
import Logger from '../../loaders/logger';
import models from '../../models';
import responseService from '../_helper/response.service';
import organizationService from './organization.service';

var { Organization, sequelize } = models;

module.exports = {
    createOrganization,
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
