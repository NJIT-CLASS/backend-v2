import models from '../../models';
import Logger from '../../loaders/logger';
var { Section, SectionUser sequelize } = models;

module.exports = {
    createSection,
    createSectionUser,
    updateSection,
    updateSectionUser,
    deleteSection,
    deleteSectionUser
}

async function createSection(sectionObject, t){
    try {
        const section = await Section.create(sectionObject,{
            transaction:t
        });
        Logger.info('SectionService::createSection::SectionID:' + section.UserID);
        return section;
    } catch (e) {
        Logger.error(e)
    }
}

async function createSectionUser(sectionUserObject, t){
    try {
        const sectionUser = await Section.create(sectionUserObject,{
            transaction:t
        });
        Logger.info('SectionService::createSectionUser::SectionUserID:' + sectionUser.UserID);
        return sectionUser;
    } catch (e) {
        Logger.error(e)
    }
}

async function updateSection(sectionObject, t){
    try {
        const sectionUser = await Section.create(sectionObject,{
            transaction:t
        });
        Logger.info('SectionService::createSectionUser::SectionUserID:' + sectionUser.UserID);
        return sectionUser;
    } catch (e) {
        Logger.error(e)
    }
}

async function updateSectionUser(sectionObject, t){
    try {
        const sectionUser = await Section.create(sectionObject,{
            transaction:t
        });
        Logger.info('SectionService::createSectionUser::SectionUserID:' + sectionUser.UserID);
    } catch (e) {
        Logger.error(e)
    }
}