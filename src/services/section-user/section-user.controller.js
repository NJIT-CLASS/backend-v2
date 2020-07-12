import userService from '../user/user.controller';

import Logger from '../../loaders/logger';
import responseService from '../_helper/response.service';
import models from '../../models';
var { SectionUser, Section, Course, sequelize } = models;

module.exports = {
    createSectionUser,
};

async function createSectionUser(req, res, next) {
    if (req.body.email === null || req.body.courseid === null || req.body.sectionid === null) {
        Logger.error('SectionUserController::createSectionUser::Missing data');
        return res.status(400).send(await responseService.errorMessage('SectionUserController::createSectionUser::Missing data'));
    }

    if (req.body.volunteer === null) {
        Logger.info('SectionUserController::createSectionUser::Volunteer null');
    } else {
        if (req.body.volunteer === 0) {
            Logger.info('SectionUserController::createSectionUser::Volunteer 0');
        } else {
            req.body.volunteer = 'Appointed';
        }
    }

    const userLogin = await userService.findOneUserLogin({
        Email: req.body.email,
    });

    if (userLogin == null) {
    }
}
