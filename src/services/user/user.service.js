import bcrypt from 'bcrypt';
import config from '../../config';
import Logger from '../../loaders/logger';
import models from '../../models';
import emailService from '../_helper/email/email.service';
var { User, UserLogin, UserContact, sequelize } = models;

module.exports = {
    createContact,
    createLogin,
    createUser,
    findAll,
    findOneUser,
    findAllUsers,
    findOneUserContact,
    findAllUserContacts,
    findOneUserLogin,
    findAllUserLogins,
    updateContact,
    updatePassword,
    updateLogin,
    updateUser,
};

async function createUser(userObject, t) {
    const user = await User.create(userObject, {
        transaction: t,
    });
    Logger.info('UserService::createUser::UserID:', user.UserID);
    return user;
}

async function createLogin(loginObject, t) {
    const saltRounds = 11;
    const password = await bcrypt.hash(loginObject.Password, saltRounds);
    loginObject.Password = password;
    const login = await UserLogin.create(loginObject, {
        transaction: t,
    });
    Logger.info('UserService::createLogin::UserID:' + login.UserID);
    return login;
}

async function createContact(contactObject, t) {
    const contact = await UserContact.create(contactObject, {
        transaction: t,
    });
    Logger.info('UserService::createContact::UserID:' + contact.UserID);
    return contact;
}

async function findOneUser(attributes) {
    const user = await User.findOne({
        where: attributes,
    });

    Logger.info('UserService::findOneUser::UserID:' + user.UserID);
    return user;
}

async function findAllUsers() {
    const user = await User.findAll({
        where: attributes,
    });

    Logger.info('UserService::findAllUsers::Count:' + user.length);
    return user;
}

async function findAll() {
    const users = await User.findAll();
    Logger.info('UserService::findAll::count:' + users.length);
    return users;
}

async function findOneUserContact(attributes) {
    const contact = await UserContact.findOne({
        where: attributes,
    });
    Logger.info('UserService::findOneContact::UserID:' + contact.UserID);
    return contact;
}

async function findAllUserContacts(attributes) {
    const contact = await UserContact.findAll({
        where: attributes,
    });
    Logger.info('UserService::findAllContacts::Count:' + contact.length);
    return contact;
}

async function findOneUserLogin(attributes) {
    const userLogin = await UserLogin.findOne({
        where: attributes,
    });
    Logger.info('UserService::findOneUserLogin::UserID:' + userLogin.UserID);
    return userLogin;
}

async function findAllUserLogins(attributes) {
    const userLogin = await UserLogin.findAll({
        where: attributes,
    });
    Logger.info('UserService::findAllUserLogins::Count:' + userLogin.length);
    return userLogin;
}

async function updateUser(userObject, t) {
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
}

async function updatePassword(loginObject, t) {
    const saltRounds = 11;
    const password = await bcrypt.hash(loginObject.Password, saltRounds);
    const login = await UserLogin.update(
        {
            Password: password,
            Pending: true,
            Timeout: null,
            Attempts: 0,
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
}

async function updateLogin(loginObject, t) {
    const { UserID, ...loginObjectWithoutID } = loginObject;
    const login = await UserLogin.update(
        loginObjectWithoutID,
        {
            where: {
                UserID: UserID,
            },
        },
        {
            transaction: t,
        }
    );
    Logger.info('UserService::updateLogin::UserID:' + login.UserID);
    return login;
}

async function updateContact(contactObject, t) {
    const { UserID, ...contactObjectWithoutID } = contactObject;
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
}
