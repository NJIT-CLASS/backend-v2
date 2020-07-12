import Logger from '../../loaders/logger';
import responseService from '../_helper/response.service';
import models from '../../models';
var { SectionUser, Section, Course, sequelize } = models;

module.exports = {
    createSectionUser,
    findOneSectionUser,
    findAllSectionUsers,
};

async function createSectionUser(sectionUserObject, t) {
    const sectionUser = await SectionUser.create(sectionUserObject, {
        transaction: t,
    });

    if (sectionUser == null) {
        Logger.info('SectionUserService::createSectionUser::SectionUser not found');
        return null;
    } else {
        Logger.info('SectionUserService::createSectionUser::SectionUserID: ' + sectionUser.SectionUserID);
        return sectionUser;
    }
}

async function findOneSectionUser(attributes) {
    const sectionUser = await SectionUser.findOne({
        where: attributes,
    });

    if (sectionUser == null) {
        Logger.info('SectionUserService::findOneSectionUser::SectionUser not found');
        return null;
    } else {
        Logger.info('SectionUserService::findOneSectionUser::SectionUserID: ' + sectionUser.SectionUserID);
        return sectionUser;
    }
}

async function findAllSectionUsers(attributes) {
    const sectionUser = await SectionUser.findAll({
        where: attributes,
    });

    if (sectionUser == null) {
        Logger.info('SectionUserService::findAllSectionUsers::SectionUser not found');
        return null;
    } else {
        Logger.info('SectionUserService::findAllSectionUsers::Count: ' + sectionUser.length);
        return sectionUser;
    }
}
