import config from '../../config';
import Logger from '../../loaders/logger';
import models from '../../models';
import responseService from '../_helper/response.service';
import courseService from './course.service';

var { Course, Section, Organization, Semester, sequelize } = models;

module.exports = {
    createCourse,
    findCourseWithSection,
    updateCourse,
};

async function createCourse(req, res, next) {
    try {
        if (req.body.UserID == null || req.body.Name == null || req.body.number == null || req.body.organizationid == null) {
            Logger.error('CourseController::createCourse::Missing data');
            return res.status(400).send(await responseService.errorMessage('CourseController::createCourse::Missing data'));
        }

        const course = await courseService.findOneCourse({
            CreatorID: req.body.UserID,
            Number: req.body.number,
            Name: req.body.Name,
            OrganizationID: req.body.organizationid, //new
        });

        if (course != null) {
            Logger.error('CourseController::createCourse::Course exist. CourseID: ' + course.CourseID);
            return res.status(400).send(await responseService.errorMessage('CourseController::createCourse::Course exist. CourseID: ' + course.CourseID));
        }

        const t = await sequelize.transaction();
        const newCourse = await courseService.createCourse(
            {
                CreatorID: req.body.UserID,
                Number: req.body.number,
                Name: req.body.Name,
                OrganizationID: req.body.organizationid,
            },
            t
        );

        if (newCourse == null) {
            Logger.error('CourseController::createCourse::Cannot create course');
            return res.status(400).send(await responseService.errorMessage('CourseController::createCourse::Cannot create course'));
        } else {
            await t.commit();
            res.status(201).send(
                await responseService.successMessage({
                    NewCourse: newCourse,
                    Message: true,
                })
            );
        }
    } catch (e) {
        Logger.error('CourseController::createCourse::' + e);
        return res.status(500).send(await responseService.errorMessage('CourseController::createCourse::' + e));
    }
}

async function findCourseWithSection(req, res, next) {
    try {
        const course = await Course.findOne({
            where: {
                CourseID: req.params.courseId,
            },
            attributes: ['CourseID', 'Number', 'Name', 'Description'],
            include: {
                model: Organization,
                attributes: ['Name'],
            },
        });

        if (course == null) {
            Logger.error('CourseController::findCourseWithSection::Course is empty.');
            return res.status(400).send(await responseService.errorMessage('CourseController::findCourseWithSection::Course is empty.'));
        }

        const sections = await Section.findAll({
            where: {
                CourseID: req.params.courseId,
            },
            include: [
                {
                    model: Semester,
                    attributes: ['Name'],
                },
            ],
        });

        Logger.info('CourseController::findCourseWithSection::CourseID: ' + course.CourseID + ' Section Count: ' + sections.length);

        res.status(200).json(
            await responseService.successMessage({
                Error: false,
                Message: 'Success',
                Course: course,
                Sections: sections,
            })
        );
    } catch (e) {
        Logger.error('CourseController::findOneCourse::' + e);
        return res.status(500).send(await responseService.errorMessage('CourseController::findOneCourse::' + e));
    }
}

async function updateCourse(req, res, next) {
    try {
        if (req.body.courseid == null) {
            Logger.error('CourseController::updateCourse::Missing data');
            return res.status(400).send(await responseService.errorMessage('CourseController::updateCourse::Missing data'));
        }

        const t = await sequelize.transaction();
        const course = await courseService.updateCourse(
            {
                CourseID: req.body.courseid,
                Name: req.body.Name,
                Number: req.body.Number,
            },
            t
        );

        const updatedCourse = await courseService.findOneCourse({
            CourseID: req.body.courseid,
            Name: req.body.Name,
            Number: req.body.Number,
        });

        if (updatedCourse == null) {
            Logger.error('CourseController::updateCourse::Cannot update course. CourseID: ' + req.body.courseid);
            return res
                .status(400)
                .send(await responseService.errorMessage('CourseController::updateCourse::Cannot update course. CourseID: ' + req.body.courseid));
        } else {
            await t.commit();
            Logger.info('CourseController::updateCourse::CourseID: ' + req.body.courseid);
            res.status(200).json(
                await responseService.successMessage({
                    Error: false,
                    Message: 'Success',
                    result: course,
                    CourseUpdated: updatedCourse,
                })
            );
        }
    } catch (e) {
        Logger.error('CourseController::updateCourse::' + e);
        return res.status(500).send(await responseService.errorMessage('CourseController::updateCourse::' + e));
    }
}
