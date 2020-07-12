import models from '../../models';
import Logger from '../../loaders/logger';
var { Section, sequelize } = models;

module.exports = {
    createSection,
    findOneSection,
    findAllSections,
    updateSection,
};

async function createSection(sectionObject, t) {
    const section = await Section.create(sectionObject, {
        transaction: t,
    });

    if (section == null) {
        Logger.info('SectionService::createSection::Section not found');
        return null;
    } else {
        Logger.info('SectionService::createSection::SectionID: ' + section.SectionID);
        return section;
    }
}

async function findOneSection(attributes) {
    const section = await Section.findOne({
        where: attributes,
    });

    if (section == null) {
        Logger.info('SectionService::findOneSection::Section not found');
        return null;
    } else {
        Logger.info('SectionService::findOneSection::SectionID: ' + section.SectionID);
        return section;
    }
}

async function findAllSections(attributes) {
    const section = await Section.findAll({
        where: attributes,
    });

    if (section == null) {
        Logger.info('SectionService::findAllSections::Section not found');
        return null;
    } else {
        Logger.info('SectionService::findAllSections::Count: ' + section.length);
        return section;
    }
}

async function updateSection(sectionObject, t) {
    const { SectionID, ...sectionObjectWithoutID } = sectionObject;
    const section = await Section.update(
        sectionObjectWithoutID,
        {
            where: {
                SectionID: SectionID,
            },
        },
        {
            transaction: t,
        }
    );
    Logger.info('SectionService::updateSection::SectionID: ' + section.SectionID);
    return section;
}
