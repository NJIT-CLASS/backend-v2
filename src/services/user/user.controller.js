import userService from './user.service';
import responseService from '../_helper/response.service';
import faker from 'faker';
import { sequelize } from '../../models';
import Logger from '../../loaders/logger';
import { response } from 'express';

module.exports = {
    createUser,
    createFakeUser,
    findAll,
};

async function createUser(req, res, next) {
    try {
        const data = req.body;
        const t = await sequelize.transaction();
        const user = await userService.createUser(req.body, t);
        data.UserID = user.UserID;
        await userService.createLogin(data, t);
        await userService.createContact(data, t);
        await t.commit();
        res.status(201).send(user);
    } catch (e) {
        Logger.error(e);
        res.status(400).send(await responseService.errorMessage('UserController::createUser::' + e));
    }
}

async function createFakeUser(req, res, next) {
    try {
        const data = {
            FirstName: faker.name.firstName(),
            LastName: faker.name.lastName(),
            Email: faker.internet.email(),
            Phone: faker.phone.phoneNumber(),
            Role: req.body.role,
            Admin: req.body.admin,
            Instructor: req.body.instructor,
            Organization: 'NJIT',
            Password: 'testuserpl',
        };
        const t = await sequelize.transaction();
        const user = await userService.createUser(data, t);
        data.UserID = user.UserID;
        await userService.createLogin(data, t);
        await userService.createContact(data, t);
        await t.commit();
        res.status(201).send(user);
    } catch (e) {
        Logger.error(e);
        res.status(400).send(await responseService.errorMessage('UserController::createFakeUser::' + e));
    }
}

async function findAll(req, res, next) {
    try {
        const users = await userService.findAll();
        res.status(200).send(responseService.successMessage(users));
    } catch (e) {
        Logger.error(e);
        res.status(400).send(await responseService.errorMessage('UserController::findAll::' + e));
    }
}
