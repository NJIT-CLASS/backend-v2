import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config';
import Role from '../_helper/roles';
import Logger from '../../loaders/logger';
import models from '../../models';
import emailService from '../../services/_helper/email/email.service';
var { User, UserLogin, UserContact, sequelize } = models;

module.exports = {
    authenticate,
    createContact,
    createLogin,
    createUser,
    find,
    findAll,
    updateContact,
    updatePassword,
    updateUser,
};

async function authenticate({ email, password }) {
    const login = await UserLogin.findOne({
        where: {
            email: email,
        },
    });

    const checkPassword = await bcrypt.compare(password, login.Password);
    if (checkPassword) {
        const user = await User.findOne({
            where: {
                UserID: login.UserID,
            },
        });
        if (user) {
            const token = jwt.sign({ sub: user.UserID, role: user.Role }, config.secret);
            Logger.info('UserService::authenticate::UserID:', user.UserID);
            return {
                user,
                token,
            };
        }
    }
}

async function createUser(userObject, t) {
    try {
        const user = await User.create(userObject, {
            transaction: t,
        });
        Logger.info('UserService::createUser::UserID:', user.UserID);
        return user;
    } catch (e) {
        Logger.error(e);
    }
}

async function createLogin(loginObject, t) {
    try {
        const saltRounds = 11;
        const password = await bcrypt.hash(loginObject.Password, saltRounds);
        const login = await UserLogin.create(loginObject, {
            transaction: t,
        });
        Logger.info('UserService::createLogin::UserID:' + login.UserID);
        return login;
    } catch (e) {
        Logger.error(e);
    }
}

async function createContact(contactObject, t) {
    try {
        const contact = await UserContact.create(contactObject, {
            transaction: t,
        });
        Logger.info('UserService::createContact::UserID:' + contact.UserID);
        return contact;
    } catch (e) {
        Logger.error(e);
    }
}

async function find(attributes) {
    try {
        const user = await User.findOne({
            where: attributes,
        });

        Logger.info('UserService::findUser::UserID:' + user.UserID);
        return user;
    } catch (e) {
        Logger.error(e);
    }
}

async function findAll() {
    try {
        emailService.send();
        const users = await User.findAll();
        Logger.info('UserService::findAll::count:' + users.length);
        return users;
    } catch (e) {
        Logger.error(e);
    }
}

async function findContact(UserID) {
    try {
        const contact = await UserContact.findOne({
            where: attributes,
        });
        Logger.info('UserService::findContact::UserID:' + contact.UserID);
        return contact;
    } catch (e) {
        Logger.error(e);
    }
}

async function updateUser(userObject, t) {
    try {
        const { UserID, ...userObjectWithoutID } = userObject;
        const user = await User.update(
            userObjectWithoutID,
            {
                where: {
                    UserID,
                },
            },
            {
                transaction: t,
            }
        );
        Logger.info('UserService::updateUser::UserID:', user.UserID);
        return user;
    } catch (e) {
        Logger.error(e);
    }
}

async function updatePassword(loginObject, t) {
    try {
        const saltRounds = 11;
        const password = await bcrypt.hash(loginObject.password, saltRounds);
        const login = await UserLogin.update(
            {
                UserID: loginObject.UserID,
                Email: loginObject.email,
                Password: password,
            },
            {
                where: {
                    UserID: loginObject.UserID,
                },
            },
            {
                transaction: t,
            }
        );
        Logger.info('UserService::updatePassword::UserID:' + login.UserID);
        return login;
    } catch (e) {
        Logger.error(e);
    }
}

async function updateContact(contactObject, t) {
    try {
        const { UserID, ...contactObjectWithoutID } = userObject;
        const contact = await UserContact.update(
            contactObjectWithoutID,
            {
                where: {
                    UserID: UserID,
                },
            },
            {
                transaction: t,
            }
        );
        Logger.info('UserService::updateContact::UserID:' + contact.UserID);
        return contact;
    } catch (e) {
        Logger.error(e);
    }
}
