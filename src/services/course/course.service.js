import config from '../../config';
import Logger from '../../loaders/logger';
import models from '../../models';

var { Course, sequelize } = models;

module.exports = {
    createCourse,
    findOneCourse,
    findAllCourses,
    updateCourse,
    deleteCourse,
};

async function createCourse(courseObject, t) {
    const course = await Course.create(courseObject, { transaction: t });

    if (course == null) {
        Logger.error('courseService::createCourse::Cannot create course');
        return null;
    } else {
        Logger.info('courseService::createCourse::courseID: ' + course.CourseID);
        return course;
    }
}

async function findOneCourse(attributes) {
    const course = await Course.findOne({
        where: attributes,
    });
    if (course == null) {
        Logger.info('courseService::findOneCourse::Course not found');
        return null;
    } else {
        Logger.info('courseService::findOneCourse::CourseID: ' + course.CourseID);
        return course;
    }
}

async function findAllCourses(attributes) {
    const course = await Course.findAll({
        where: attributes,
    });
    if (course == null) {
        Logger.info('courseService::findAllCourses::Course not found');
        return null;
    } else {
        Logger.info('courseService::findAllCourses::Count: ' + course.length);
        return course;
    }
}

async function updateCourse(courseObject, t) {
    const { CourseID, ...courseObjectWithoutID } = courseObject;
    const course = await Course.update(courseObjectWithoutID, {
        where: {
            CourseID: CourseID,
        },
        transaction: t,
    });
    Logger.info('CourseService::updateCourse::CourseID:' + course.CourseID);
    return course;
}

async function deleteCourse(courseObject, t) {
    const course = await Course.destroy({
        where: courseObject,
        transaction: t,
    });
    Logger.info('CourseService::deleteCourse::Course Deleted');
    return course;
}
