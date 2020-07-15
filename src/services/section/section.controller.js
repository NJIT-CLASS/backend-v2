import sectionService from './section.service';
import semesterService from '../semester/semester.service';
import Logger from '../../loaders/logger';
import responseService from '../_helper/response.service';
import models from '../../models';
import e from 'express';
var { Section, sequelize } = models;

module.exports = {
    createSection,
    updateSection,
    findOneSection,
    deleteSection,
};

async function createSection(req, res, next) {
    try {
        if (req.body.semesterid == null || req.body.courseid == null || req.body.name == null) {
            Logger.error('SectionController::createSection::Missing data');
            return res.status(400).send(await responseService.errorMessage('SectionController::createSection::Missing data'));
        }

        const semester = await semesterService.findOneSemester({ SemesterID: req.body.semesterid });

        if (semester == null) {
            Logger.error('SectionController::createSection::Cannot find semester. SemesterID: ' + req.body.semesterid);
            return res
                .status(400)
                .send(await responseService.errorMessage('SectionController::createSection::Cannot find semester. SemesterID: ' + req.body.semesterid));
        }

        const section = await sectionService.findOneSection({ SemesterID: req.body.semesterid, Name: req.body.name });
        if (section != null) {
            Logger.error('SectionController::createSection::Section with same name already exist.');
            return res.status(400).send(await responseService.errorMessage('SectionController::createSection::Section with same name already exist.'));
        }

        const t = await sequelize.transaction();
        const newSection = await sectionService.createSection(
            {
                SemesterID: req.body.semesterid,
                CourseID: req.body.courseid,
                StartDate: semester.StartDate,
                EndDate: semester.EndDate,
                Name: req.body.name,
            },
            t
        );

        if (newSection != null) {
            await t.commit();
            Logger.info('SectionController::createSection::SectionID: ' + newSection.SectionID);
            return res.status(200).send(
                await responseService.successMessage({
                    result: newSection,
                })
            );
        } else {
            Logger.error('SectionController::createSection::Cannot create a new section');
            return res.status(400).send(await responseService.errorMessage('SectionController::createSection::Cannot create a new section'));
        }
    } catch (e) {
        Logger.error('SectionController::createSection::' + e);
        return res.status(500).send(await responseService.errorMessage('SectionController::createSection::' + e));
    }
}

async function updateSection(req, res, next) {
    try {
        if (req.body.sectionid == null || req.body.name == null) {
            Logger.error('SectionController::updateSection::Missing data');
            return res.status(400).send(await responseService.errorMessage('SectionController::updateSection::Missing data'));
        }

        const section = await sectionService.updateSection({
            SectionID: req.body.sectionid,
            Name: req.body.name,
            Description: req.body.description || '',
        });

        const updatedSection = await sectionService.findOneSection({
            SectionID: req.body.sectionid,
            Name: req.body.name,
            Description: req.body.description || '',
        });

        if (updatedSection == null) {
            Logger.error('SectionController::updateSection::Cannot update a section');
            return res.status(400).send(await responseService.errorMessage('SectionController::updateSection::Cannot update a section'));
        } else {
            Logger.info('SectionController::updateSection::SectionID: ' + updatedSection.SectionID);
            res.status(200).json(
                await responseService.successMessage({
                    Error: false,
                    Message: 'Success',
                    result: section,
                    CourseUpdated: updatedSection,
                })
            );
        }
    } catch (e) {
        Logger.error('SectionController::updateSection::' + e);
        return res.status(500).send(await responseService.errorMessage('SectionController::updateSection::' + e));
    }
}

async function findOneSection(req, res, next) {
    try {
        if (req.params.sectionid == null) {
            Logger.error('SectionController::findOneSection::SectionID is null');
            return res.status(400).send(await responseService.errorMessage('SectionController::findOneSection::SectionID is null'));
        }

        const section = await sectionService.findOneSection({
            SectionID: req.params.sectionid,
        });

        if (section == null) {
            Logger.error('SectionController::findOneSection::Cannot find section. SectionID: ' + req.params.sectionid);
            return res
                .status(400)
                .send(await responseService.errorMessage('SectionController::findOneSection::Cannot find section. SectionID: ' + req.params.sectionid));
        } else {
            Logger.info('SectionController::findOneSection::SectionID: ' + section.SectionID);
            res.status(200).json(
                await responseService.successMessage({
                    Error: false,
                    Message: 'Success',
                    Section: section,
                })
            );
        }
    } catch (e) {
        Logger.error('SectionController::findOneSection::' + e);
        return res.status(500).send(await responseService.errorMessage('SectionController::findOneSection::' + e));
    }
}

async function deleteSection(req, res, next) {
    try {
        if (req.params.sectionid == null) {
            Logger.error('SectionController::deleteSection::SectionID is null');
            return res.status(400).send(await responseService.errorMessage('SectionController::deleteSection::SectionID is null'));
        }

        const t = await sequelize.transaction();
        const section = await sectionService.deleteSection(
            {
                SectionID: req.params.sectionid,
            },
            t
        );

        if (section == null) {
            Logger.error('SectionController::deleteSection::Cannot find section. SectionID: ' + req.params.sectionid);
            return res
                .status(400)
                .send(await responseService.errorMessage('SectionController::deleteSection::Cannot find section. SectionID: ' + req.params.sectionid));
        } else {
            await t.commit();
            Logger.info('SectionController::deleteSection::SectionID: ' + section.SectionID);
            res.status(200).json(
                await responseService.successMessage({
                    Error: false,
                    Message: 'Success',
                    Section: section,
                })
            );
        }
    } catch (e) {
        Logger.error('SectionController::deleteSection::' + e);
        return res.status(500).send(await responseService.errorMessage('SectionController::deleteSection::' + e));
    }
}
