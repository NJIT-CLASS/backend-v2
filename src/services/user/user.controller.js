import userService from './user.service';
import faker from 'faker';
import { sequelize } from '../../models';
import Logger from '../../loaders/logger';

module.exports = {
    authenticate,
    createUser,
    createFakeUser,
    findAll,
};

async function authenticate(req, res, next) {
    try {
        const user = await userService.authenticate(req.body);
        res.json(user);
    } catch (e) {
        Logger.error(e);
    }
}

async function createUser(req, res, next) {
    try {
        const data = req.body;
        const t = await sequelize.transaction();
        const user = await userService.createUser(req.body, t);
        data.UserID = user.UserID;
        await userService.createLogin(data, t);
        await userService.createContact(data, t);
        await t.commit();
        res.json(user);
    } catch (e) {
        Logger.error(e);
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
        res.json(user);
    } catch (e) {
        Logger.error(e);
    }
}

async function findAll(req, res, next) {
    try {
        const users = await userService.findAll();
        res.json(users);
    } catch (e) {
        Logger.error(e);
    }
}
